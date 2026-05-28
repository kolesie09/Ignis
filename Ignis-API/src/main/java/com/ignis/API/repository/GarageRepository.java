package com.ignis.API.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ignis.API.entity.Garage;

public interface GarageRepository extends JpaRepository<Garage, Long> {
}
