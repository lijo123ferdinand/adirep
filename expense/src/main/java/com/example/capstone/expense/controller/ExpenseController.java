package com.example.capstone.expense.controller;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.sql.Date;
import java.util.Collection;
import java.util.Collections;
import java.time.ZoneId;
// import java.util.Date;
// import java.time.LocalDate;
// import java.time.format.DateTimeParseException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.time.format.DateTimeFormatter;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
// import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.capstone.expense.dto.ExpenseRequest;
import com.example.capstone.expense.model.Budget;
import com.example.capstone.expense.model.Expense;
import com.example.capstone.expense.model.User;
import com.example.capstone.expense.repository.BudgetRepository;
import com.example.capstone.expense.repository.ExpenseRepository;
import com.example.capstone.expense.repository.UserRepository;

import jakarta.transaction.Transactional;

@RestController
@RequestMapping("/api")
public class ExpenseController {
    
    private final UserRepository userRepository;
    private final ExpenseRepository expenseRepository;
    private final BudgetRepository budgetRepository;


    public ExpenseController(UserRepository userRepository, ExpenseRepository expenseRepository,BudgetRepository budgetRepository) {
        this.userRepository = userRepository;
        this.expenseRepository = expenseRepository;
        this.budgetRepository =budgetRepository;
    }

    // Retrieve expenses by user email
    @GetMapping("/expensesByEmail")
    Collection<Expense> getExpensesByEmail(@RequestParam String email) {
        return expenseRepository.findByUserEmail(email);
    }

    // Retrieve expenses by date
    @GetMapping("/user/expensesByDate")
    public Collection<Expense> getExpensesByEmailAndDate(
            @RequestParam String email,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDateTime expense_date) {

        // Find the user by email
        User user = userRepository.findByEmail(email);

        // Check if user exists
        if (user == null) {
            System.out.println("User Not Found!");
            return Collections.emptyList(); // Return empty list if user not found
        }

        // Query expenses based on user and date
        return expenseRepository.findByUserAndExpenseDate(user, expense_date);
    }


    @GetMapping("/user/expensesByDateRange")
    public Collection<Expense> getExpensesByDateRange(
            @RequestParam String email,
            @RequestParam String startDate,
            @RequestParam String endDate) {
    
        // Define the date format expected
        DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
    
        // Parse the date strings to LocalDateTime
        LocalDateTime startLocalDateTime = LocalDateTime.parse(startDate.trim(), formatter);
        LocalDateTime endLocalDateTime = LocalDateTime.parse(endDate.trim(), formatter);
    
        // Convert LocalDateTime to Instant
        Instant startInstant = startLocalDateTime.atZone(ZoneId.systemDefault()).toInstant();
        Instant endInstant = endLocalDateTime.atZone(ZoneId.systemDefault()).toInstant();
    
        // Convert Instant to java.sql.Date
        Date startDateAsSqlDate = Date.valueOf(startLocalDateTime.toLocalDate());
        Date endDateAsSqlDate = Date.valueOf(endLocalDateTime.toLocalDate());
    
        return expenseRepository.findByUserEmailAndExpenseDateBetween(email, startDateAsSqlDate, endDateAsSqlDate);
    }
    
    
    

    //Retrieve a user's expenses by category
    @GetMapping("/user/expensesByCategory")
    public Collection<Expense> getExpensesByCategory(
            @RequestParam String email,
            @RequestParam String category) {
        // Retrieve expenses for the given user and category
        return expenseRepository.findByUserEmailAndCategory(email, category);
    }

    //Total expense done by a user on a particular category within the date range 
    @GetMapping("/user/totalExpenseByCategoryAndDateRange")
    public Map<String, BigDecimal> getTotalExpenseByCategoryAndDateRange(
            @RequestParam String email,
            @RequestParam String category,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        // Retrieve expenses for the given user, category, and date range
        Collection<Expense> expenses = expenseRepository.findByUserEmailAndCategoryAndExpenseDateBetween(email, category, startDate, endDate);
 
        // Calculate total expense for the category
        BigDecimal totalExpense = expenses.stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
 
        // Create a map to hold the result
        Map<String, BigDecimal> result = new HashMap<>();
        result.put(category, totalExpense);
 
        return result;
    }

    @PostMapping("/user/expenses")
    public ResponseEntity<String> addExpense(@RequestBody ExpenseRequest expenseRequest) {
        User user = userRepository.findByEmail(expenseRequest.getEmail());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    
        Budget budget = budgetRepository.findByUserAndCategory(user, expenseRequest.getCategory());
        if (budget != null) {
            BigDecimal expenseAmount = expenseRequest.getAmount();
            BigDecimal availableAmount = budget.getAvailableAmount();
    
            if (expenseAmount.compareTo(availableAmount) > 0) {
                return ResponseEntity.badRequest().body("Expense exceeds budget limit");
            }
    
            budget.setAvailableAmount(availableAmount.subtract(expenseAmount));
            budgetRepository.save(budget);
        }
    
        BigDecimal expenseAmount = expenseRequest.getAmount();
        BigDecimal currentBalance = user.getBalance();
        if (currentBalance.compareTo(expenseAmount) < 0) {
            return ResponseEntity.badRequest().body("Insufficient balance");
        }
    
        BigDecimal newBalance = currentBalance.subtract(expenseAmount);
        user.setBalance(newBalance);
    
        Expense newExpense = new Expense();
        newExpense.setUser(user);
        newExpense.setCategory(expenseRequest.getCategory());
        newExpense.setAmount(expenseRequest.getAmount());
        newExpense.setExpenseDate(Date.from(LocalDateTime.now().atZone(ZoneId.systemDefault()).toInstant()));    
        expenseRepository.save(newExpense);
        userRepository.save(user);
    
        return ResponseEntity.status(HttpStatus.CREATED).body("Expense added successfully");
    }
    


    @Transactional
    @DeleteMapping("/user/expenses/deleteAllExpenses")
    public ResponseEntity<String> deleteExpensesByEmail(@RequestParam String email) {
        // Find the user by email
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
 
        // Delete all expenses associated with the user
        expenseRepository.deleteByUser(user);
 
        return ResponseEntity.status(HttpStatus.OK).body("Expenses deleted successfully for user " + email);
    }

    @DeleteMapping("/user/expenses/delete/{expenseId}")
    public ResponseEntity<String> deleteExpenseByEmailAndId(@RequestParam String email, @PathVariable Long expenseId) {
        // Find the user by email
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
 
        // Find the expense by ID
        Optional<Expense> optionalExpense = expenseRepository.findById(expenseId);
        if (!optionalExpense.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Expense not found");
        }
 
        // Check if the expense belongs to the user
        Expense expense = optionalExpense.get();
        if (!expense.getUser().equals(user)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Expense does not belong to the specified user");
        }
 
        // Delete the expense
        expenseRepository.deleteById(expenseId);
 
        return ResponseEntity.status(HttpStatus.OK).body("Expense deleted successfully");
    }

    @GetMapping("/user/expenses/analysis")
    public ResponseEntity<String> getUserExpensesAnalysis(@RequestParam String email) {

        // Retrieve all expenses for the user
        Collection<Expense> allUserExpenses = expenseRepository.findByUserEmail(email);
 
        // Calculate total amount spent by the user
        BigDecimal totalAmountSpentByUser = allUserExpenses.stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
 
        // Group expenses by category
        Map<String, BigDecimal> categoryTotalAmounts = allUserExpenses.stream()

                .collect(Collectors.groupingBy(Expense::getCategory,

                        Collectors.mapping(Expense::getAmount, Collectors.reducing(BigDecimal.ZERO, BigDecimal::add))));
 
        // Calculate total amount spent across all categories

        BigDecimal totalAmountSpentAcrossAllCategories = categoryTotalAmounts.values().stream()

                .reduce(BigDecimal.ZERO, BigDecimal::add);
 
        // Create a response message

        StringBuilder responseMessage = new StringBuilder();

        responseMessage.append(String.format("Total percentage spent across all categories by user %s:\n", email));

        // Calculate and append percentage spent on each category

        for (Map.Entry<String, BigDecimal> entry : categoryTotalAmounts.entrySet()) {

            String category = entry.getKey();

            BigDecimal categoryTotalAmount = entry.getValue();

            BigDecimal percentageSpent = BigDecimal.ZERO;

            if (totalAmountSpentAcrossAllCategories.compareTo(BigDecimal.ZERO) > 0) {

                percentageSpent = categoryTotalAmount

                        .divide(totalAmountSpentAcrossAllCategories, 4, RoundingMode.HALF_UP)

                        .multiply(BigDecimal.valueOf(100));

            }

            responseMessage.append(String.format("%s:%s%%\n", category, percentageSpent));

        }
 
        return ResponseEntity.status(HttpStatus.OK).body(responseMessage.toString());

    }


}
