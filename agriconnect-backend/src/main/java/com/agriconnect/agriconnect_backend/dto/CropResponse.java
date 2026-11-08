package com.agriconnect.agriconnect_backend.dto;

import com.agriconnect.agriconnect_backend.entity.Crop;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class CropResponse {

    private Long id;
    private Long farmId;
    private String cropName;
    private String variety;
    private String season;
    private Double areaInAcres;
    private Integer wateringIntervalDays;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate lastWateredDate;

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
        r.setWateringIntervalDays(crop.getWateringIntervalDays());
        r.setLastWateredDate(crop.getLastWateredDate());
        return r;
    }
}

