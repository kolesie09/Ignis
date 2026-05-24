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
@Table(name = "vehicle_to_card")
public class VehicleToCard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "card_id", nullable = false)
    private Card card;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "firefighter_id", nullable = false)
    private Firefighter firefighter;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "garage_id", nullable = false)
    private Garage garage;

    public VehicleToCard() {
    }

    public VehicleToCard(Card card, Firefighter firefighter, Garage garage) {
        this.card = card;
        this.firefighter = firefighter;
        this.garage = garage;
    }

    public Integer getId() {
        return id;
    }

    public Card getCard() {
        return card;
    }

    public Firefighter getFirefighter() {
        return firefighter;
    }

    public Garage getGarage() {
        return garage;
    }
}
