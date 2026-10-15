package com.agriconnect.agriconnect_backend.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "crop")
public class Crop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private String cropName;
    private String verity;
    private String season;
    private Double areaInAcres;

    @ManyToOne
    @JoinColumn(name="farm_id")
    private Farm farm;


}
