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
@Table(name = "firefighter_action_role")
public class FirefighterActionRole {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "vehicle_to_card_id", nullable = false)
    private VehicleToCard vehicleToCard;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "type_function_id", nullable = false)
    private TypeFunction typeFunction;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "firefighter_id", nullable = false)
    private Firefighter firefighter;

    public FirefighterActionRole() {
    }

    public FirefighterActionRole(
            VehicleToCard vehicleToCard,
            TypeFunction typeFunction,
            Firefighter firefighter
    ) {
        this.vehicleToCard = vehicleToCard;
        this.typeFunction = typeFunction;
        this.firefighter = firefighter;
    }

    public Long getId() {
        return id;
    }

    public VehicleToCard getVehicleToCard() {
        return vehicleToCard;
    }

    public TypeFunction getTypeFunction() {
        return typeFunction;
    }

    public Firefighter getFirefighter() {
        return firefighter;
    }
}
