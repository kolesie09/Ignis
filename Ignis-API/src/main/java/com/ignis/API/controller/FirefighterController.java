package com.ignis.API.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ignis.API.dto.request.ApproveFirefighterRequest;
import com.ignis.API.dto.response.FirefighterResponse;
import com.ignis.API.service.FirefighterService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/firefighters")
public class FirefighterController {

    private final FirefighterService firefighterService;

    public FirefighterController(FirefighterService firefighterService) {
        this.firefighterService = firefighterService;

    }

    @GetMapping
    public ResponseEntity<List<FirefighterResponse>> getAllFirefighters(Authentication authentication) {
        String login = authentication.getName();
        return ResponseEntity.ok(firefighterService.getFirefightersFromMyStation(login));
    }

    @GetMapping("/{id}")
    public ResponseEntity<FirefighterResponse> getFirefighterById(@PathVariable Long id) {
        return ResponseEntity.ok(firefighterService.getFirefighterById(id));
    }

    @GetMapping("/me")
    public ResponseEntity<FirefighterResponse> getCurrentFirefighter(Authentication authentication) {
        String login = authentication.getName();
        return ResponseEntity.ok(firefighterService.getCurrentFirefighter(login));
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<FirefighterResponse>> getPendingFirefighters(Authentication authentication) {
        return ResponseEntity.ok(firefighterService.getPendingFirefightersFromMyStation(authentication.getName()));
    }

    @PatchMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> patchApproveCandidat(@PathVariable Long id, @Valid @RequestBody ApproveFirefighterRequest request, Authentication authentication) {
        Long statusId = request.firefighterStatusId();
        firefighterService.approveFirefighter(id, statusId, authentication.getName());
        return ResponseEntity.noContent().build();
    }

}
