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
@Table(name = "incident")
public class Incident {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "incident_type_id", nullable = false)
    private IncidentType incidentType;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "created_by_id", nullable = false)
    private Firefighter createdBy;

    @Column(name = "date_log")
    private LocalDateTime dateLog;

    public Incident() {
    }

    public Incident(String name, IncidentType incidentType, Firefighter createdBy) {
        this.name = name;
        this.incidentType = incidentType;
        this.createdBy = createdBy;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public IncidentType getIncidentType() {
        return incidentType;
    }

    public Firefighter getCreatedBy() {
        return createdBy;
    }

    public LocalDateTime getDateLog() {
        return dateLog;
    }
}
