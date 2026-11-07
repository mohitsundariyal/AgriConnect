package com.agriconnect.agriconnect_backend.dto;

import com.agriconnect.agriconnect_backend.entity.Expense;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class ExpenseResponse {

    private Long id;
    private Long farmId;
    private Long cropId;
    private String category;
    private String description;
    private BigDecimal amount;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate expenseDate;

    public static ExpenseResponse from(Expense expense) {
        if (expense == null) {
            return null;
        }
        ExpenseResponse r = new ExpenseResponse();
        r.setId(expense.getId());
        r.setFarmId(expense.getFarm() != null ? expense.getFarm().getId() : null);
        r.setCropId(expense.getCrop() != null ? expense.getCrop().getId() : null);
        r.setCategory(expense.getCategory());
        r.setDescription(expense.getDescription());
        r.setAmount(expense.getAmount());
        r.setExpenseDate(expense.getExpenseDate());
        return r;
    }
}
