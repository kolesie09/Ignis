package com.ignis.API.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ignis.API.entity.VehicleToCard;

public interface VehicleToCardRepository extends JpaRepository<VehicleToCard, Long> {
}
