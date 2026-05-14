package com.ignis.API.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ignis.API.entity.Firefighter;
import com.ignis.API.service.FirefighterService;

@RestController
@RequestMapping("/api/firefighters")
public class FirefighterController {

    private final FirefighterService firefighterService;

    public FirefighterController(FirefighterService firefighterService) {
        this.firefighterService = firefighterService;
    }

    @GetMapping
    public ResponseEntity<List<Firefighter>> getAllFirefighters() {
        return ResponseEntity.ok(firefighterService.getAllFirefighters());
    }
}
