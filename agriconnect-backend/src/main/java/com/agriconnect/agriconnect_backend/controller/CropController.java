package com.agriconnect.agriconnect_backend.controller;

import com.agriconnect.agriconnect_backend.dto.CropRequest;
import com.agriconnect.agriconnect_backend.dto.CropResponse;
import com.agriconnect.agriconnect_backend.service.CropService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/crops")
public class CropController {

    private final CropService cropService;

    public CropController(CropService cropService) {
        this.cropService = cropService;
    }

    @PostMapping
    public ResponseEntity<CropResponse> addCrop(@Valid @RequestBody CropRequest request) {
        CropResponse response = cropService.createCrop(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/farm/{farmId}")
    public List<CropResponse> getCropsByFarm(@PathVariable Long farmId) {
        return cropService.getCropsByFarm(farmId);
    }

    @GetMapping("/{id}")
    public CropResponse getCrop(@PathVariable Long id) {
        return cropService.getCrop(id);
    }

    @PutMapping("/{id}")
    public CropResponse updateCrop(@PathVariable Long id, @Valid @RequestBody CropRequest request) {
        return cropService.updateCrop(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteCrop(@PathVariable Long id) {
        cropService.deleteCrop(id);
        return ResponseEntity.ok(Map.of("message", "Crop deleted"));
    }
}

