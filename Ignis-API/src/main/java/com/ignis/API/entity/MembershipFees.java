package com.ignis.API.entity;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "membership_fees")
public class MembershipFees {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "firefighter_id", nullable = false)
    private Firefighter firefighter;

    private Integer year;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "price_membership_fees_id", nullable = false)
    private PriceMembershipFees priceMembershipFees;

    private LocalDate dateOfPayment;

    private Boolean statusPayment;

    public MembershipFees() {
    }

    public Long getId() {
        return id;
    }

    public Firefighter getFirefighter() {
        return firefighter;
    }

    public Integer getYear() {
        return year;
    }

    public PriceMembershipFees getPriceMembershipFees() {
        return priceMembershipFees;
    }

    public LocalDate getDateOfPayment() {
        return dateOfPayment;
    }

    public Boolean getStatusPayment() {
        return statusPayment;
    }

}
