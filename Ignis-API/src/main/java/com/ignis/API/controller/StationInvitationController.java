package com.ignis.API.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ignis.API.service.StationInvitationService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;

import com.ignis.API.dto.request.RegisterByInvitationRequest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.ignis.API.service.InvitationPosterService;
import org.springframework.http.MediaType;
import org.springframework.http.HttpHeaders;

@RestController
@RequestMapping("/api/station-invitations")
public class StationInvitationController {

    private final StationInvitationService stationInvitationService;
    private final InvitationPosterService invitationPosterService;

    public StationInvitationController(StationInvitationService stationInvitationService, InvitationPosterService invitationPosterService) {
        this.stationInvitationService = stationInvitationService;
        this.invitationPosterService = invitationPosterService;
    }

    @PostMapping("/generate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> getGenerateInvitation(Authentication authentication, @RequestParam("validDays") int validDays) {
        String token = stationInvitationService.createInvitation(authentication.getName(), validDays);
        return ResponseEntity.status(HttpStatus.CREATED).body(token);
    }

    @PostMapping("/register")
    public ResponseEntity<Void> register(@Valid @RequestBody RegisterByInvitationRequest request) {
        stationInvitationService.registerByInvitation(request);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/{token}/poster")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<byte[]> poster(@PathVariable String token, Authentication authentication) {

        byte[] pdf = invitationPosterService.generatePoster(token, authentication.getName());

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"zaproszenie.pdf\"")
                .body(pdf);

    }

}
