package com.agriconnect.agriconnect_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FarmRequest {

    // Without JWT, the client sends which farmer owns this farm
    @NotNull(message = "farmerId is required")
    private Long farmerId;

    @NotBlank(message = "farm name is required")
    private String farmName;

    @NotBlank(message = "location is required")
    private String location;

    @NotNull(message = "area is required")
    @Positive(message = "area must be greater than 0")
    private Double areaInAcres;
}