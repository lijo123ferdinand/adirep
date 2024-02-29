package com.example.capstone.expense.repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.capstone.expense.model.Expense;
import com.example.capstone.expense.model.User;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByCategory(String category);

    Collection<Expense> findByUserEmail(String email);

    Collection<Expense> findByExpenseDateBetween(LocalDateTime startDate, LocalDateTime endDate);

    Collection<Expense> findByExpenseDate(LocalDateTime expense_date);

    Collection<Expense> findByUserAndExpenseDate(User user, LocalDateTime expense_date);

    Collection<Expense> findByUserEmailAndExpenseDateBetween(String email, LocalDateTime startDate,
            LocalDateTime endDate);
		
}