package com.agriconnect.agriconnect_backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "farms")
@Data
public class Farm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String farmName;
    private String location;
    private Double areaInAcres;

    @ManyToOne
    @JoinColumn(name = "farmer_id")
    private Farmer farmer;
}