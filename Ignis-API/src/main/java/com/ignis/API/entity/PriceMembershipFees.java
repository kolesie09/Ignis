package com.ignis.API.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "price_membership_fees")
public class PriceMembershipFees {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer price;

    private Integer fromYear;

    public PriceMembershipFees() {
    }

    public Long getId() {
        return id;
    }

    public Integer getPrice() {
        return price;
    }

    public Integer getFromYear() {
        return fromYear;
    }

}
