package com.ignis.API.controller;

import com.ignis.API.dto.VehicleResponse;
import com.ignis.API.repository.GarageRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
