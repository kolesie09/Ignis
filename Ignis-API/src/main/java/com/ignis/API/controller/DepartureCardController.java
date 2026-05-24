package com.ignis.API.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ignis.API.dto.DepartureCardRequest;
import com.ignis.API.dto.DepartureCardResponse;
import com.ignis.API.service.DepartureCardService;

@RestController
@RequestMapping("/api/departure-cards")
public class DepartureCardController {

    private final DepartureCardService departureCardService;

    public DepartureCardController(DepartureCardService departureCardService) {
        this.departureCardService = departureCardService;
    }

    @PostMapping
    public ResponseEntity<DepartureCardResponse> createDepartureCard(
            @RequestBody DepartureCardRequest request,
            Authentication authentication
    ) {
        String login = authentication.getName();

        return ResponseEntity.ok(
                departureCardService.createDepartureCard(request, login)
        );
    }
}
