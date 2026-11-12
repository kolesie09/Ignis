package com.ignis.API.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "fire_station")
public class FireStation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(
            name = "name",
            nullable = false,
            unique = true
    )
    private String name;

    @Column(name = "year_of_establishment")
    private LocalDate establishmentDate;

    @ManyToOne
    @JoinColumn(name = "municipality_id", nullable = false)
    private Municipality municipality;

    protected FireStation() {
    }

    public FireStation(
            String name,
            LocalDate establishmentDate,
            Municipality municipality
    ) {
        this.name = name;
        this.establishmentDate = establishmentDate;
        this.municipality = municipality;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public LocalDate getEstablishmentDate() {
        return establishmentDate;
    }

    public Municipality getMunicipality() {
        return municipality;
    }

}
