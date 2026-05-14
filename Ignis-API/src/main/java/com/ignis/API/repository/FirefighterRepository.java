package com.ignis.API.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ignis.API.entity.Firefighter;

public interface FirefighterRepository extends JpaRepository<Firefighter, Integer> {
}
