package com.ignis.API.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "firefighter_status")
public class FirefighterStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    public FirefighterStatus() {
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }
}
