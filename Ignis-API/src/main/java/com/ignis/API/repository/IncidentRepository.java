package com.ignis.API.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ignis.API.entity.Incident;
import com.ignis.API.entity.IncidentType;

public interface IncidentRepository extends JpaRepository<Incident, Integer> {

    List<Incident> findByIncidentType(IncidentType incidentType);

    Optional<Incident> findByNameAndIncidentType(String name, IncidentType incidentType);
}
