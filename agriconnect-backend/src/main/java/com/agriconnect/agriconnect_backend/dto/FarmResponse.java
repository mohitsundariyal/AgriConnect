package com.agriconnect.agriconnect_backend.dto;

import com.agriconnect.agriconnect_backend.entity.Farm;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FarmResponse {

    private Long id;
    private Long farmerId;
    private String farmName;
    private String location;
    private Double areaInAcres;

    public static FarmResponse from(Farm farm) {
        FarmResponse r = new FarmResponse();
        r.setId(farm.getId());
        r.setFarmerId(farm.getFarmer().getId());
        r.setFarmName(farm.getFarmName());
        r.setLocation(farm.getLocation());
        r.setAreaInAcres(farm.getAreaInAcres());
        return r;
    }
}