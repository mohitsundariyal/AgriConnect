package com.agriconnect.agriconnect_backend.controller;


import com.agriconnect.agriconnect_backend.dto.LoginRequest;
import com.agriconnect.agriconnect_backend.dto.RegisterFarmer;
import com.agriconnect.agriconnect_backend.entity.Farmer;
import com.agriconnect.agriconnect_backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.awt.*;
import java.util.Map;

@RestController
@RequestMapping("api/auth")
public class AuthController {

        private final AuthService authService;

        public AuthController(AuthService authService) {
            this.authService = authService;
        }

        @PostMapping("/register")
        public ResponseEntity<Map<String, String>> registerFarmer(@Valid @RequestBody RegisterFarmer request) {
            authService.createFarmer(request);
            return ResponseEntity.ok(Map.of("message", "registration successful"));
        }

        @PostMapping("/login")
        public ResponseEntity<Map<String,String>> loginFarmer(@Valid @RequestBody LoginRequest request){
            Farmer farmer = authService.loginFarmer(request);
            return ResponseEntity.ok(Map.of(
                    "message", "login successful",
                    "id", String.valueOf(farmer.getId()),
                    "name", farmer.getName(),
                    "email", farmer.getEmail(),
                    "village", farmer.getVillage(),
                    "phone", farmer.getPhone()
            ));
        }
    }
