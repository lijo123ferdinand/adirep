package com.example.capstone.expense.controller;

import java.math.BigDecimal;
import java.util.Collection;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.capstone.expense.dto.SalaryRequest;
import com.example.capstone.expense.model.User;
import com.example.capstone.expense.repository.UserRepository;
import com.example.capstone.expense.security.PasswordHashing;

@RestController
@RequestMapping("/api")
public class UserController {
    
    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
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
        // Find the user by email
        User existingUser = userRepository.findByEmail(loginUser.getEmail());
        if (existingUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }

        // Verify the password
        if (!PasswordHashing.verifyPassword(loginUser.getPassword(), existingUser.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }

        // Authentication successful
        return ResponseEntity.ok("Login successful");
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

}