package com.example.capstone.expense.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class SetBudgetRequest {
    private String email;
    private String category;
    private BigDecimal amount;
}
