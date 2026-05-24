package com.ignis.API.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ignis.API.dto.IncidentRequest;
import com.ignis.API.dto.IncidentResponse;
import com.ignis.API.entity.Firefighter;
import com.ignis.API.entity.Incident;
import com.ignis.API.entity.IncidentType;
import com.ignis.API.repository.FirefighterRepository;
import com.ignis.API.repository.IncidentRepository;
import com.ignis.API.repository.IncidentTypeRepository;

@RestController
@RequestMapping("/api/incidents")
public class IncidentController {

    private final IncidentRepository incidentRepository;
    private final IncidentTypeRepository incidentTypeRepository;
    private final FirefighterRepository firefighterRepository;

    public IncidentController(
            IncidentRepository incidentRepository,
            IncidentTypeRepository incidentTypeRepository,
            FirefighterRepository firefighterRepository
    ) {
        this.incidentRepository = incidentRepository;
        this.incidentTypeRepository = incidentTypeRepository;
        this.firefighterRepository = firefighterRepository;
    }

    @GetMapping
    public ResponseEntity<List<IncidentResponse>> getIncidentsByIncidentType(
            @RequestParam Integer incidentTypeId
    ) {
        IncidentType incidentType = incidentTypeRepository.findById(incidentTypeId)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono kategorii zdarzenia."));

        List<IncidentResponse> response = incidentRepository
                .findByIncidentType(incidentType)
                .stream()
                .map(incident -> new IncidentResponse(
                incident.getId(),
                incident.getName()
        ))
                .toList();

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<?> createIncident(@RequestBody IncidentRequest request) {
        String name = request.getName() == null
                ? ""
                : request.getName().trim();

        if (name.isEmpty()) {
            return ResponseEntity.badRequest().body("Nazwa powodu nie może być pusta.");
        }

        if (request.getIncidentTypeId() == null) {
            return ResponseEntity.badRequest().body("Najpierw wybierz kategorię.");
        }

        IncidentType incidentType = incidentTypeRepository
                .findById(request.getIncidentTypeId())
                .orElse(null);

        if (incidentType == null) {
            return ResponseEntity.badRequest().body("Wybrana kategoria nie istnieje.");
        }

        boolean exists = incidentRepository
                .findByNameAndIncidentType(name, incidentType)
                .isPresent();

        if (exists) {
            return ResponseEntity.status(409)
                    .body("Taki powód już istnieje w wybranej kategorii.");
        }

        Firefighter createdBy = firefighterRepository
                .findById(1)
                .orElse(null);

        if (createdBy == null) {
            return ResponseEntity.badRequest()
                    .body("Nie znaleziono strażaka dodającego powód.");
        }

        Incident savedIncident = incidentRepository.save(
                new Incident(name, incidentType, createdBy)
        );

        return ResponseEntity.ok(
                new IncidentResponse(savedIncident.getId(), savedIncident.getName())
        );
    }
}
