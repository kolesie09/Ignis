package com.ignis.API.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "city")
public class City {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "fire_station_id", nullable = false)
    private FireStation fireStation;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "created_by_id", nullable = false)
    private Firefighter createdBy;

    @Column(name = "date_log")
    private LocalDateTime dateLog;

    public City() {
    }

    public City(String name, FireStation fireStation, Firefighter createdBy) {
        this.name = name;
        this.fireStation = fireStation;
        this.createdBy = createdBy;
    }

    public Integer getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public FireStation getFireStation() {
        return fireStation;
    }

    public Firefighter getCreatedBy() {
        return createdBy;
    }

    public LocalDateTime getDateLog() {
        return dateLog;
    }
}
