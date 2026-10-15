package com.agriconnect.agriconnect_backend.Repository;

import com.agriconnect.agriconnect_backend.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense,Long> {
    // All expenses of one farm
    List<Expense> findByFarmId(Long farmId);

    // All expenses of one crop
    List<Expense> findByCropId(Long cropId);
}
