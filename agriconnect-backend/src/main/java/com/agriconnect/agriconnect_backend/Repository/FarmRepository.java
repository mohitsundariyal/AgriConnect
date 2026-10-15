package com.agriconnect.agriconnect_backend.Repository;

import com.agriconnect.agriconnect_backend.entity.Farm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FarmRepository extends JpaRepository<Farm, Long> {

    // All farms of one farmer
    List<Farm> findByFarmerId(Long farmerId);
}