package com.ignis.API.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "firefighter")
public class Firefighter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "firefighter_status_id", nullable = false)
    private FirefighterStatus firefighterStatus;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "fire_station_id", nullable = false)
    private FireStation fireStation;

    public Firefighter() {
    }

    public Integer getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public FirefighterStatus getFirefighterStatus() {
        return firefighterStatus;
    }

    public FireStation getFireStation() {
        return fireStation;
    }
}
