package com.agriconnect.agriconnect_backend.Repository;

import com.agriconnect.agriconnect_backend.entity.Crop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CropRepository extends JpaRepository<Crop, Long> {

    // All crops of one farm
    List<Crop> findByFarmId(Long farmId);
}