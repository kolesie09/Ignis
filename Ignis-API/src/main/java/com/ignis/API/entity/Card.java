package com.ignis.API.entity;

import java.time.LocalDate;
import java.time.LocalTime;

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
@Table(name = "card")
public class Card {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "departure_number", nullable = false)
    private Integer departureNumber;

    @Column(name = "departure_date", nullable = false)
    private LocalDate departureDate;

    @Column(name = "hour_departure", nullable = false)
    private LocalTime departureTime;

    @Column(name = "hour_return", nullable = false)
    private LocalTime returnTime;

    @Column(name = "trip", nullable = false)
    private Integer trip;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "place_id", nullable = false)
    private Place place;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "incident_id", nullable = false)
    private Incident incident;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "email_send_id", nullable = false)
    private EmailSend emailSend;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "commander_id", nullable = false)
    private Firefighter commander;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "type_card_id", nullable = false)
    private TypeCard typeCard;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "created_by_id", nullable = false)
    private Firefighter createdBy;

    public Card() {
    }

    public Card(
            Integer departureNumber,
            LocalDate departureDate,
            LocalTime departureTime,
            LocalTime returnTime,
            Integer trip,
            Place place,
            Incident incident,
            EmailSend emailSend,
            Firefighter commander,
            TypeCard typeCard,
            Firefighter createdBy
    ) {
        this.departureNumber = departureNumber;
        this.departureDate = departureDate;
        this.departureTime = departureTime;
        this.returnTime = returnTime;
        this.trip = trip;
        this.place = place;
        this.incident = incident;
        this.emailSend = emailSend;
        this.commander = commander;
        this.typeCard = typeCard;
        this.createdBy = createdBy;
    }

    public Long getId() {
        return id;
    }

    public Integer getDepartureNumber() {
        return departureNumber;
    }

    public LocalDate getDepartureDate() {
        return departureDate;
    }

    public LocalTime getDepartureTime() {
        return departureTime;
    }

    public LocalTime getReturnTime() {
        return returnTime;
    }

    public Integer getTrip() {
        return trip;
    }

    public Place getPlace() {
        return place;
    }

    public Incident getIncident() {
        return incident;
    }

    public EmailSend getEmailSend() {
        return emailSend;
    }

    public Firefighter getCommander() {
        return commander;
    }

    public TypeCard getTypeCard() {
        return typeCard;
    }

    public Firefighter getCreatedBy() {
        return createdBy;
    }

}
