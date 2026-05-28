package com.ignis.API.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ignis.API.entity.Firefighter;

public interface FirefighterRepository extends JpaRepository<Firefighter, Long> {

    Optional<Firefighter> findByUserLogin(String login);
}
