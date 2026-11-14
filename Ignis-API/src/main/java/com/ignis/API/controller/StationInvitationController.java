package com.ignis.API.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ignis.API.service.StationInvitationService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/station-invitations")
public class StationInvitationController {

    private final StationInvitationService stationInvitationService;

    public StationInvitationController(StationInvitationService stationInvitationService) {
        this.stationInvitationService = stationInvitationService;
    }

    @PostMapping("/generate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> getGenerateInvitation(Authentication authentication, @RequestParam("validDays") int validDays) {
        String token = stationInvitationService.createInvitation(authentication.getName(), validDays);
        return ResponseEntity.status(HttpStatus.CREATED).body(token);
    }

}
