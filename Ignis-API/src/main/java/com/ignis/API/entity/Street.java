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
@Table(name = "street")
public class Street {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    // Relacja do miasta, do którego należy ulica
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "city_id", nullable = false)
    private City city;

    // Informacje o użytkowniku, który utworzył ulicę
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "created_by_id", nullable = false)
    private Firefighter createdBy;

    // Data utworzenia ulicy
    @Column(name = "date_log")
    private LocalDateTime dateLog;

    public Street() {
    }

    public Street(String name, City city, Firefighter createdBy) {
        this.name = name;
        this.city = city;
        this.createdBy = createdBy;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public City getCity() {
        return city;
    }

    public Firefighter getCreatedBy() {
        return createdBy;
    }

    public LocalDateTime getDateLog() {
        return dateLog;
    }
}
