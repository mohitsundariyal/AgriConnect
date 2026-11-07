package com.agriconnect.agriconnect_backend.dto;

import com.agriconnect.agriconnect_backend.entity.Crop;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CropResponse {

    private Long id;
    private Long farmId;
    private String cropName;
    private String variety;
    private String season;
    private Double areaInAcres;

    public static CropResponse from(Crop crop) {
        if (crop == null) {
            return null;
        }
        CropResponse r = new CropResponse();
        r.setId(crop.getId());
        r.setFarmId(crop.getFarm() != null ? crop.getFarm().getId() : null);
        r.setCropName(crop.getCropName());
        r.setVariety(crop.getVariety());
        r.setSeason(crop.getSeason());
        r.setAreaInAcres(crop.getAreaInAcres());
        return r;
    }
}

