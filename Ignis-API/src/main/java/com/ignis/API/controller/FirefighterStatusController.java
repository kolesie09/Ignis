package com.ignis.API.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ignis.API.dto.response.FirefighterStatusResponse;
import com.ignis.API.service.FirefighterStatusService;

@RestController
@RequestMapping("/api/firefighter-statuses")
public class FirefighterStatusController {

    private final FirefighterStatusService firefighterStatusService;

    public FirefighterStatusController(FirefighterStatusService firefighterStatusService) {
        this.firefighterStatusService = firefighterStatusService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<FirefighterStatusResponse>> getAllFirefighterStatuses() {
        return ResponseEntity.ok(firefighterStatusService.getAllFirefighterStatus());
    }

}
