package com.ignis.API.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ignis.API.dto.CreateStreetRequest;
import com.ignis.API.dto.StreetResponse;
import com.ignis.API.service.StreetService;

@RestController
@RequestMapping("/api/streets")
public class StreetController {

    private final StreetService streetService;

    // Konstruktor do wstrzykiwania zależności
    public StreetController(StreetService streetService) {
        this.streetService = streetService;
    }

    @GetMapping
    public ResponseEntity<List<StreetResponse>> getStreetsByCity(@RequestParam Integer cityId) {
        return ResponseEntity.ok(streetService.getStreetsByCity(cityId));
    }

    @PostMapping
    public ResponseEntity<StreetResponse> createStreet(@RequestBody CreateStreetRequest request, Authentication authentication) {
        String login = authentication.getName();
        return ResponseEntity.ok(streetService.createStreet(login, request));
    }

}
