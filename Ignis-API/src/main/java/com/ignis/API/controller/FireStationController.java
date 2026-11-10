package com.ignis.API.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ignis.API.dto.request.CreateFireStationRequest;
import com.ignis.API.dto.response.FireStationResponse;
import com.ignis.API.service.FireStationService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/fire-stations")
public class FireStationController {

    private final FireStationService fireStationService;

    public FireStationController(
            FireStationService fireStationService
    ) {
        this.fireStationService = fireStationService;
    }

    @GetMapping
    public ResponseEntity<List<FireStationResponse>>
            getAllFireStations() {

        return ResponseEntity.ok(
                fireStationService.getAllFireStations()
        );
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FireStationResponse> createFireStation(
            @Valid
            @RequestBody CreateFireStationRequest request
    ) {
        FireStationResponse response
                = fireStationService.createFireStation(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }
}
