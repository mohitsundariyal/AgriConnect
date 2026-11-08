package com.agriconnect.agriconnect_backend.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

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
    private String variety;
    private String season;
    private Double areaInAcres;

    private Integer wateringIntervalDays;
    private LocalDate lastWateredDate;

    @ManyToOne
    @JoinColumn(name="farm_id")
    private Farm farm;


}
