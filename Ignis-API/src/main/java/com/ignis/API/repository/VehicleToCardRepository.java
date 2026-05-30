package com.ignis.API.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ignis.API.entity.VehicleToCard;

public interface VehicleToCardRepository extends JpaRepository<VehicleToCard, Long> {

    List<VehicleToCard> findByCardId(Long CardId);
}
