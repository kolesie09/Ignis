package com.ignis.API.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ignis.API.entity.FirefighterStatus;

public interface FirefighterStatusRepository extends JpaRepository<FirefighterStatus, Long> {

    List<FirefighterStatus> findAllByOrderByNameAsc();

    Optional<FirefighterStatus> findByName(String name);
}
