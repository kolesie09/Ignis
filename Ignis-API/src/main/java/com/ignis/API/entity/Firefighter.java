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
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "name")
    private User name;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "lastname")
    private User lastname;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "firefighter_status_id", nullable = false)
    private FirefighterStatus firefighterStatus;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "fire_station_id", nullable = false)
    private FireStation fireStation;

    public Firefighter() {
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public User getName() {
        return name;
    }

    public User getLastname() {
        return lastname;
    }

    public FirefighterStatus getFirefighterStatus() {
        return firefighterStatus;
    }

    public FireStation getFireStation() {
        return fireStation;
    }
}
