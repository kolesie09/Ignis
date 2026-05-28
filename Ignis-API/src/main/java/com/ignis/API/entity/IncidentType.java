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
@Table(name = "incident_type")
public class IncidentType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "type_card_id", nullable = false)
    private TypeCard typeCard;

    public IncidentType() {
    }

    public IncidentType(String name, TypeCard typeCard) {
        this.name = name;
        this.typeCard = typeCard;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public TypeCard getTypeCard() {
        return typeCard;
    }
}
