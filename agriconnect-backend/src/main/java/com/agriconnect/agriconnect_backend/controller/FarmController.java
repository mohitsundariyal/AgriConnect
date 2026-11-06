package com.agriconnect.agriconnect_backend.controller;

import com.agriconnect.agriconnect_backend.dto.FarmRequest;
import com.agriconnect.agriconnect_backend.dto.FarmResponse;
import com.agriconnect.agriconnect_backend.service.FarmService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/farms")
public class FarmController {

    private final FarmService farmService;

    public FarmController(FarmService farmService) {
        this.farmService = farmService;
    }

    // Add a new farm
    @PostMapping
    public ResponseEntity<FarmResponse> addFarm(@Valid @RequestBody FarmRequest request) {
        FarmResponse response = farmService.createFarm(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Get all farms of one farmer
    @GetMapping("/farmer/{farmerId}")
    public List<FarmResponse> getFarmsByFarmer(@PathVariable Long farmerId) {
        return farmService.getFarmsByFarmer(farmerId);
    }

    // Get one farm
    @GetMapping("/{id}")
    public FarmResponse getFarm(@PathVariable Long id) {
        return farmService.getFarm(id);
    }

    // Update a farm
    @PutMapping("/{id}")
    public FarmResponse updateFarm(@PathVariable Long id, @Valid @RequestBody FarmRequest request) {
        return farmService.updateFarm(id, request);
    }

    // Delete a farm
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteFarm(@PathVariable Long id) {
        farmService.deleteFarm(id);
        return ResponseEntity.ok(Map.of("message", "Farm deleted"));
    }
}