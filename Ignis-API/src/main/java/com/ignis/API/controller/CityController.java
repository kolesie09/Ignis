package com.ignis.API.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ignis.API.dto.CityResponse;
import com.ignis.API.dto.CreateCityRequest;
import com.ignis.API.service.CityService;

@RestController
@RequestMapping("/api/cities")
public class CityController {

    private final CityService cityService;

    // Konstruktor do wstrzykiwania zależności
    public CityController(CityService cityService) {
        this.cityService = cityService;
    }

    // Endpoint do pobierania miast dla aktualnie zalogowanego użytkownika  
    @GetMapping
    public ResponseEntity<List<CityResponse>> getCities(Authentication authentication) {
        String login = authentication.getName();

        return ResponseEntity.ok(cityService.getCitiesForCurrentUser(login));
    }

    // Endpoint do tworzenia nowego miasta dla aktualnie zalogowanego użytkownika
    @PostMapping
    public ResponseEntity<CityResponse> createCity(
            @RequestBody CreateCityRequest request,
            Authentication authentication
    ) {
        String login = authentication.getName();

        return ResponseEntity.ok(cityService.createCity(login, request));
    }
}
