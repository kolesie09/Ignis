package com.ignis.API.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "place")
public class Place {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "city_id", nullable = false)
    private City city;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "street_id")
    private Street street;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "created_by_id", nullable = false)
    private Firefighter createdBy;

    public Place() {
    }

    public Place(City city, Street street, Firefighter createdBy) {
        this.city = city;
        this.street = street;
        this.createdBy = createdBy;
    }

    public Integer getId() {
        return id;
    }

    public City getCity() {
        return city;
    }

    public Street getStreet() {
        return street;
    }

    public Firefighter getCreatedBy() {
        return createdBy;
    }
}
