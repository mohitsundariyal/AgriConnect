package com.agriconnect.agriconnect_backend.service;

import com.agriconnect.agriconnect_backend.Repository.FarmRepository;
import com.agriconnect.agriconnect_backend.Repository.FarmerRepository;
import com.agriconnect.agriconnect_backend.dto.FarmRequest;
import com.agriconnect.agriconnect_backend.dto.FarmResponse;
import com.agriconnect.agriconnect_backend.entity.Farm;
import com.agriconnect.agriconnect_backend.entity.Farmer;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class FarmService {

    private final FarmRepository farmRepository;
    private final FarmerRepository farmerRepository;

    public FarmService(FarmRepository farmRepository, FarmerRepository farmerRepository) {
        this.farmRepository = farmRepository;
        this.farmerRepository = farmerRepository;
    }

    public FarmResponse createFarm(FarmRequest request) {
        Farmer farmer = farmerRepository.findById(request.getFarmerId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Farmer not found"));

        Farm farm = new Farm();
        farm.setFarmer(farmer);
        farm.setFarmName(request.getFarmName().trim());
        farm.setLocation(request.getLocation().trim());
        farm.setAreaInAcres(request.getAreaInAcres());

        return FarmResponse.from(farmRepository.save(farm));
    }

    public List<FarmResponse> getFarmsByFarmer(Long farmerId) {
        return farmRepository.findByFarmerId(farmerId)
                .stream()
                .map(FarmResponse::from)
                .toList();
    }

    public FarmResponse getFarm(Long id) {
        return FarmResponse.from(findFarm(id));
    }

    public FarmResponse updateFarm(Long id, FarmRequest request) {
        Farm farm = findFarm(id);
        farm.setFarmName(request.getFarmName().trim());
        farm.setLocation(request.getLocation().trim());
        farm.setAreaInAcres(request.getAreaInAcres());
        return FarmResponse.from(farmRepository.save(farm));
    }

    public void deleteFarm(Long id) {
        farmRepository.delete(findFarm(id));
    }

    // Reused by CropService and ExpenseService later
    public Farm findFarm(Long id) {
        return farmRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Farm not found"));
    }
}