package com.ignis.API.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ignis.API.dto.response.IncidentTypeResponse;
import com.ignis.API.entity.TypeCard;
import com.ignis.API.repository.IncidentTypeRepository;
import com.ignis.API.repository.TypeCardRepository;

@RestController
@RequestMapping("/api/incident-types")
public class IncidentTypeController {

    private final IncidentTypeRepository incidentTypeRepository;
    private final TypeCardRepository typeCardRepository;

    public IncidentTypeController(
            IncidentTypeRepository incidentTypeRepository,
            TypeCardRepository typeCardRepository
    ) {
        this.incidentTypeRepository = incidentTypeRepository;
        this.typeCardRepository = typeCardRepository;
    }

    @GetMapping
    public ResponseEntity<List<IncidentTypeResponse>> getIncidentTypes() {
        TypeCard typeCard = typeCardRepository.findByName("Karta wyjazdu")
                .orElseThrow(() -> new RuntimeException("Nie znaleziono typu karty: Karta wyjazdu"));

        List<IncidentTypeResponse> response = incidentTypeRepository
                .findByTypeCard(typeCard)
                .stream()
                .map(incidentType -> new IncidentTypeResponse(
                incidentType.getId(),
                incidentType.getName()
        ))
                .toList();

        return ResponseEntity.ok(response);
    }
}
