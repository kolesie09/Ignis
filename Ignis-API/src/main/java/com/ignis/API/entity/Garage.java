package com.ignis.API.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "garage")
public class Garage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "car_operational_number")
    private String carOperationalNumber;

    @Column(name = "places")
    private Integer places;

    public Integer getId() {
        return id;
    }

    public String getCarOperationalNumber() {
        return carOperationalNumber;
    }

    public Integer getPlaces() {
        return places;
    }
}
