package com.ignis.API.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ignis.API.dto.response.FirefighterResponse;
import com.ignis.API.service.FirefighterService;

@RestController
@RequestMapping("/api/firefighters")
public class FirefighterController {

    private final FirefighterService firefighterService;

    public FirefighterController(FirefighterService firefighterService) {
        this.firefighterService = firefighterService;
    }

    @GetMapping
    public ResponseEntity<List<FirefighterResponse>> getAllFirefighters() {
        return ResponseEntity.ok(firefighterService.getAllFirefighters());
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

}
