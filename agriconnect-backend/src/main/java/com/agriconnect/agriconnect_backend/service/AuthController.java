package com.agriconnect.agriconnect_backend.service;


import com.agriconnect.agriconnect_backend.Repository.CropRepository;
import com.agriconnect.agriconnect_backend.Repository.ExpenseRepository;
import com.agriconnect.agriconnect_backend.Repository.FarmRepository;
import com.agriconnect.agriconnect_backend.Repository.FarmerRepository;
import com.agriconnect.agriconnect_backend.entity.Farmer;
import org.springframework.stereotype.Service;

@Service
public class AuthController {
   private final FarmerRepository farmerRepository;
   private final CropRepository cropRepository;
  private final ExpenseRepository expenseRepository;
  private final FarmRepository farmRepository;



    AuthController(FarmerRepository farmerRepository,
    CropRepository cropRepository,
                   ExpenseRepository expenseRepository,
    FarmRepository farmRepository) {
        this.farmerRepository = farmerRepository;
        this.cropRepository = cropRepository;
        this.expenseRepository = expenseRepository;
        this.farmRepository = farmRepository;
    }
       public void createFarmer(){
        Farmer farmer = new Farmer();



        }

   }
