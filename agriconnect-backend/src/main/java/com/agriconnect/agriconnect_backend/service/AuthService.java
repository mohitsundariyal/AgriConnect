package com.agriconnect.agriconnect_backend.service;

import com.agriconnect.agriconnect_backend.Repository.FarmerRepository;
import com.agriconnect.agriconnect_backend.dto.LoginRequest;
import com.agriconnect.agriconnect_backend.dto.RegisterFarmer;
import com.agriconnect.agriconnect_backend.entity.Farmer;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final FarmerRepository farmerRepository;

    public AuthService(FarmerRepository farmerRepository) {
        this.farmerRepository = farmerRepository;
    }

    public void createFarmer(RegisterFarmer request) {

        String email = request.getEmail().trim().toLowerCase();

        // Duplicate email check
        if (farmerRepository.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }

        Farmer farmer = new Farmer();
        farmer.setEmail(email);
        farmer.setName(request.getName().trim());
        farmer.setPassword(request.getPassword());
        farmer.setPhone(request.getPhone());
        farmer.setVillage(request.getVillage());
        farmerRepository.save(farmer);
    }

    public Farmer loginFarmer(LoginRequest request) {

        String email = request.getEmail().trim().toLowerCase();

        Farmer farmer = farmerRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        if (!farmer.getPassword().equals(request.getPassword())) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        return farmer;
    }


}