package com.agriconnect.agriconnect_backend.controller;

import com.agriconnect.agriconnect_backend.dto.ExpenseRequest;
import com.agriconnect.agriconnect_backend.dto.ExpenseResponse;
import com.agriconnect.agriconnect_backend.service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @PostMapping
    public ResponseEntity<ExpenseResponse> createExpense(@Valid @RequestBody ExpenseRequest request) {
        ExpenseResponse response = expenseService.createExpense(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/farm/{farmId}")
    public List<ExpenseResponse> getExpensesByFarm(@PathVariable Long farmId) {
        return expenseService.getExpensesByFarm(farmId);
    }

    @GetMapping("/farm/{farmId}/total")
    public Map<String, BigDecimal> getTotalByFarm(@PathVariable Long farmId) {
        return Map.of("total", expenseService.getTotalByFarm(farmId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
        return ResponseEntity.ok(Map.of("message", "Expense deleted"));
    }
}

