package com.agriconnect.agriconnect_backend.Repository;

import com.agriconnect.agriconnect_backend.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense,Long> {
    // All expenses of one farm
    List<Expense> findByFarmId(Long farmId);

    // All expenses of one crop
    List<Expense> findByCropId(Long cropId);

    boolean existsByCropId(Long cropId);

    List<Expense> findByFarmIdOrderByExpenseDateDescIdDesc(Long farmId);

    @Query("select coalesce(sum(e.amount), 0) from Expense e where e.farm.id = :farmId")
    BigDecimal sumAmountByFarmId(@Param("farmId") Long farmId);
}
