package com.example.capstone.expense.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateChildAccountRequest {
    private String parentEmail;
    private String childUsername;
    private String childEmail;
    private String childPassword;
    private BigDecimal initialBalance;
}
