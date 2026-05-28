package com.ignis.API.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ignis.API.dto.response.VehicleResponse;
import com.ignis.API.repository.GarageRepository;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    private final GarageRepository garageRepository;

    public VehicleController(GarageRepository garageRepository) {
        this.garageRepository = garageRepository;
    }

    @GetMapping
    public ResponseEntity<List<VehicleResponse>> getVehicles() {
        List<VehicleResponse> vehicles = garageRepository.findAll()
                .stream()
                .map(vehicle -> new VehicleResponse(
                vehicle.getId(),
                vehicle.getCarOperationalNumber(),
                vehicle.getPlaces()
        ))
                .toList();

        return ResponseEntity.ok(vehicles);
    }
}
