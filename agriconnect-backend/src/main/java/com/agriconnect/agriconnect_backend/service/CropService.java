package com.agriconnect.agriconnect_backend.service;

import com.agriconnect.agriconnect_backend.Repository.CropRepository;
import com.agriconnect.agriconnect_backend.Repository.ExpenseRepository;
import com.agriconnect.agriconnect_backend.dto.CropRequest;
import com.agriconnect.agriconnect_backend.dto.CropResponse;
import com.agriconnect.agriconnect_backend.entity.Crop;
import com.agriconnect.agriconnect_backend.entity.Farm;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CropService {

    private final CropRepository cropRepository;
    private final ExpenseRepository expenseRepository;
    private final FarmService farmService;

    public CropService(CropRepository cropRepository, ExpenseRepository expenseRepository, FarmService farmService) {
        this.cropRepository = cropRepository;
        this.expenseRepository = expenseRepository;
        this.farmService = farmService;
    }

    public CropResponse createCrop(CropRequest request) {
        Farm farm = farmService.findFarm(request.getFarmId());

        Crop crop = new Crop();
        crop.setFarm(farm);
        crop.setCropName(request.getCropName().trim());
        crop.setVariety(trimToNull(request.getVariety()));
        crop.setSeason(trimToNull(request.getSeason()));
        crop.setAreaInAcres(request.getAreaInAcres());

        return CropResponse.from(cropRepository.save(crop));
    }

    public List<CropResponse> getCropsByFarm(Long farmId) {
        farmService.findFarm(farmId);
        return cropRepository.findByFarmId(farmId)
                .stream()
                .map(CropResponse::from)
                .toList();
    }

    public CropResponse getCrop(Long id) {
        return CropResponse.from(findCrop(id));
    }

    public CropResponse updateCrop(Long id, CropRequest request) {
        Crop crop = findCrop(id);
        crop.setCropName(request.getCropName().trim());
        crop.setVariety(trimToNull(request.getVariety()));
        crop.setSeason(trimToNull(request.getSeason()));
        crop.setAreaInAcres(request.getAreaInAcres());
        return CropResponse.from(cropRepository.save(crop));
    }

    public void deleteCrop(Long id) {
        Crop crop = findCrop(id);
        if (expenseRepository.existsByCropId(id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Cannot delete a crop that has expenses");
        }
        cropRepository.delete(crop);
    }

    private Crop findCrop(Long id) {
        return cropRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Crop not found"));
    }

    private String trimToNull(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }
}

