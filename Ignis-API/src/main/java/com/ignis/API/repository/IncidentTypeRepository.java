package com.ignis.API.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ignis.API.entity.IncidentType;
import com.ignis.API.entity.TypeCard;

public interface IncidentTypeRepository extends JpaRepository<IncidentType, Long> {

    List<IncidentType> findByTypeCard(TypeCard typeCard);

    Optional<IncidentType> findByNameAndTypeCard(String name, TypeCard typeCard);
}
