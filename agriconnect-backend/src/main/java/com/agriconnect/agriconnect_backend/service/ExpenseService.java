package com.agriconnect.agriconnect_backend.service;

import com.agriconnect.agriconnect_backend.Repository.CropRepository;
import com.agriconnect.agriconnect_backend.Repository.ExpenseRepository;
import com.agriconnect.agriconnect_backend.dto.ExpenseRequest;
import com.agriconnect.agriconnect_backend.dto.ExpenseResponse;
import com.agriconnect.agriconnect_backend.entity.Crop;
import com.agriconnect.agriconnect_backend.entity.Expense;
import com.agriconnect.agriconnect_backend.entity.Farm;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final CropRepository cropRepository;
    private final FarmService farmService;

    public ExpenseService(ExpenseRepository expenseRepository, CropRepository cropRepository, FarmService farmService) {
        this.expenseRepository = expenseRepository;
        this.cropRepository = cropRepository;
        this.farmService = farmService;
    }

    public ExpenseResponse createExpense(ExpenseRequest request) {
        Farm farm = farmService.findFarm(request.getFarmId());

        Crop crop = null;
        if (request.getCropId() != null) {
            crop = cropRepository.findById(request.getCropId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Crop not found"));

            if (crop.getFarm() == null || !crop.getFarm().getId().equals(farm.getId())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Crop does not belong to this farm");
            }
        }

        Expense expense = new Expense();
        expense.setFarm(farm);
        expense.setCrop(crop);
        expense.setCategory(request.getCategory().trim());
        expense.setDescription(trimToNull(request.getDescription()));
        expense.setAmount(request.getAmount());
        expense.setExpenseDate(request.getExpenseDate());

        return ExpenseResponse.from(expenseRepository.save(expense));
    }

    public List<ExpenseResponse> getExpensesByFarm(Long farmId) {
        farmService.findFarm(farmId);
        return expenseRepository.findByFarmIdOrderByExpenseDateDescIdDesc(farmId)
                .stream()
                .map(ExpenseResponse::from)
                .toList();
    }

    public BigDecimal getTotalByFarm(Long farmId) {
        farmService.findFarm(farmId);
        BigDecimal total = expenseRepository.sumAmountByFarmId(farmId);
        return total != null ? total : BigDecimal.ZERO;
    }

    public void deleteExpense(Long id) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Expense not found"));
        expenseRepository.delete(expense);
    }

    private String trimToNull(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }
}

