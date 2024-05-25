package com.example.capstone.expense.controller;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collection;
import java.util.Objects;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.capstone.expense.dto.CreateChildAccountRequest;
import com.example.capstone.expense.dto.ResetPasswordRequest;
import com.example.capstone.expense.dto.SalaryRequest;
import com.example.capstone.expense.dto.SetBudgetRequest;
import com.example.capstone.expense.model.Budget;
import com.example.capstone.expense.model.User;
import com.example.capstone.expense.repository.BudgetRepository;
import com.example.capstone.expense.repository.UserRepository;
import com.example.capstone.expense.security.JwtSecretKeyGenerator;
import com.example.capstone.expense.security.PasswordHashing;

// import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@RestController
@RequestMapping("/api")
public class UserController {
    
    private final UserRepository userRepository;
        private final BudgetRepository budgetRepository;
        public UserController(UserRepository userRepository, BudgetRepository budgetRepository) {
            this.userRepository = userRepository;
            this.budgetRepository = budgetRepository;
        }
    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody User newUser) {
        // Check if user with the same email already exists
        User existingUser = userRepository.findByEmail(newUser.getEmail());
        if (existingUser != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User with this email already exists");
        }

        // Set the balance to the user-defined initial balance, if provided
        BigDecimal balance = newUser.getBalance();

        if (balance != null) {
            newUser.setBalance(balance);
        } else {
            // Set the balance to 0 if not provided
            newUser.setBalance(BigDecimal.ZERO);
        }

        // Hash the user's password
        String hashedPassword = PasswordHashing.hashPassword(newUser.getPassword());
        newUser.setPassword(hashedPassword);

        // Save the new user
        userRepository.save(newUser);

        return ResponseEntity.status(HttpStatus.CREATED).body("User created successfully");
    }   

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody User loginUser) {
        // Admin Login
        // if ("admin@email.com".equals(loginUser.getEmail()) && "admin".equals(loginUser.getPassword())) {
        //     return ResponseEntity.ok("Admin login successful");
        // }
    
        // Find the user by email
        User existingUser = userRepository.findByEmail(loginUser.getEmail());
        if (existingUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }

        // Verify the password
        if (!PasswordHashing.verifyPassword(loginUser.getPassword(), existingUser.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }

        // Generate JWT token
        String token = generateJwtToken(existingUser.getEmail());

        // Authentication successful
        return ResponseEntity.ok().body(token);
    }

    // Generate JWT token
    @SuppressWarnings("deprecation")
    private String generateJwtToken(String userEmail) {
        String secretKey = JwtSecretKeyGenerator.generateSecretKey();
        String token = Jwts.builder()
            .setSubject(userEmail)
            .signWith(SignatureAlgorithm.HS256, secretKey)
            .compact();
        System.out.println("GENERATED JWT TOKEN: " + token); 
        return token;
    }

    //Reset password
    @PostMapping("/user/resetPassword")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request) {
        // Check if new password matches confirm password
        if (!Objects.equals(request.getNewPassword(), request.getConfirmPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("New password does not match confirm password");
        }

        // Retrieve user by email
        User user = userRepository.findByEmail(request.getEmail());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        // Update user's password
        String hashedPassword = PasswordHashing.hashPassword(request.getNewPassword());
        user.setPassword(hashedPassword);
        userRepository.save(user);

        return ResponseEntity.status(HttpStatus.OK).body("Password reset successfully");
    }

    // Adding salary method
    @PostMapping("/user/addSalary")
    public ResponseEntity<String> addSalary(@RequestBody SalaryRequest salaryRequest) {
        // Retrieve the user by email
        User user = userRepository.findByEmail(salaryRequest.getEmail());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        // Add the salary to the user's balance
        BigDecimal currentBalance = user.getBalance();
        BigDecimal newBalance = currentBalance.add(salaryRequest.getAmount());
        user.setBalance(newBalance);

        // Save the updated user balance
        userRepository.save(user);

        return ResponseEntity.status(HttpStatus.OK).body("Salary added successfully");
    }

    @GetMapping("/user/info")
    public ResponseEntity<User> getUserInfo(@RequestParam String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        
        return ResponseEntity.status(HttpStatus.OK).body(user);
    }

    @GetMapping("/user/getBalance")
    public ResponseEntity<BigDecimal> getBalance(@RequestParam String email) {
        // Retrieve the user by email
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    
        // Get the balance of the user
        BigDecimal balance = user.getBalance();
    
        return ResponseEntity.status(HttpStatus.OK).body(balance);
    }

    @DeleteMapping("/user/delete")
    public ResponseEntity<String> deleteUser(@RequestParam String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        
        userRepository.delete(user);
        
        return ResponseEntity.status(HttpStatus.OK).body("User deleted successfully");
    }
    // Create child account
@PostMapping("/user/createChildAccount")
public ResponseEntity<String> createChildAccount(@RequestBody CreateChildAccountRequest request) {
    // Retrieve the parent user by email
    User parentUser = userRepository.findByEmail(request.getParentEmail());
    if (parentUser == null) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Parent user not found");
    }

    // Check if the usertype is "parent"
    if (!"parent".equals(parentUser.getUsertype())) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only parent users can create child accounts");
    }

    // Check if child user with the same email already exists
    User existingChildUser = userRepository.findByEmail(request.getChildEmail());
    if (existingChildUser != null) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Child user with this email already exists");
    }

    // Create a new child user
    User childUser = new User();
    childUser.setUsername(request.getChildUsername());
    childUser.setEmail(request.getChildEmail());
    childUser.setPassword(PasswordHashing.hashPassword(request.getChildPassword()));
    childUser.setUsertype("child");
    childUser.setBalance(request.getInitialBalance() != null ? request.getInitialBalance() : BigDecimal.ZERO);

    // Save the child user
    userRepository.save(childUser);

    return ResponseEntity.status(HttpStatus.CREATED).body("Child account created successfully");
}

    // Set budget for a category
    @PostMapping("/user/setBudget")
    public ResponseEntity<String> setBudget(@RequestBody SetBudgetRequest request) {
        // Retrieve the user by email
        User user = userRepository.findByEmail(request.getEmail());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        // Check if a budget already exists for the given category and user
        Budget existingBudget = budgetRepository.findByUserAndCategory(user, request.getCategory());
        if (existingBudget != null) {
            // Update the existing budget
            existingBudget.setAmount(request.getAmount());
            budgetRepository.save(existingBudget);
        } else {
            // Create a new budget
            Budget newBudget = new Budget();
            newBudget.setUser(user);
            newBudget.setCategory(request.getCategory());
            newBudget.setAmount(request.getAmount());
            newBudget.setStartDate(LocalDate.now());
            newBudget.setEndDate(LocalDate.now().plusMonths(1)); // Set end date to one month from now (example)
            budgetRepository.save(newBudget);
        }

        return ResponseEntity.status(HttpStatus.OK).body("Budget set successfully");
    }
}
