package com.example.capstone.expense.repository;

import com.example.capstone.expense.model.Budget;
import com.example.capstone.expense.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {
    Budget findByUserAndCategory(User user, String category);
}
