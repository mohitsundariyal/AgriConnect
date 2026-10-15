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

    @PostMapping
    public ResponseEntity<FarmResponse> create(@Valid @RequestBody FarmRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(farmService.createFarm(request));
    }

    @GetMapping("/farmer/{farmerId}")
    public List<FarmResponse> getByFarmer(@PathVariable Long farmerId) {
        return farmService.getFarmsByFarmer(farmerId);
    }

    @GetMapping("/{id}")
    public FarmResponse getOne(@PathVariable Long id) {
        return farmService.getFarm(id);
    }

    @PutMapping("/{id}")
    public FarmResponse update(@PathVariable Long id, @Valid @RequestBody FarmRequest request) {
        return farmService.updateFarm(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable Long id) {
        farmService.deleteFarm(id);
        return ResponseEntity.ok(Map.of("message", "Farm deleted"));
    }
}