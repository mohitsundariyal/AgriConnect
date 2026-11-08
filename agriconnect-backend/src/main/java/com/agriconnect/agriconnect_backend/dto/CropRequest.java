package com.agriconnect.agriconnect_backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CropRequest {

    @NotNull(message = "farmId is required")
    private Long farmId;

    @NotBlank(message = "crop name is required")
    @Size(max = 100)
    private String cropName;

    @Size(max = 100)
    private String variety;

    @Size(max = 50)
    private String season;

    @Positive(message = "area must be greater than 0")
    private Double areaInAcres;

    @Min(value = 1, message = "watering interval must be at least 1 day")
    @Max(value = 60, message = "watering interval cannot be more than 60 days")
    private Integer wateringIntervalDays;
}

