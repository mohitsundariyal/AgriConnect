package com.agriconnect.agriconnect_backend.dto;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class ExpenseRequest {

    @NotNull(message = "farmId is required")
    private Long farmId;

    private Long cropId;

    @NotBlank(message = "category is required")
    @Size(max = 100)
    private String category;

    @Size(max = 255)
    private String description;

    @NotNull(message = "amount is required")
    @Positive(message = "amount must be greater than 0")
    @Digits(integer = 10, fraction = 2)
    private BigDecimal amount;

    @NotNull(message = "expense date is required")
    private LocalDate expenseDate;
}

