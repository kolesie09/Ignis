package com.ignis.API.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ignis.API.dto.response.MembershipFeesResponse;
import com.ignis.API.service.MembershipFeesService;

@RestController
@RequestMapping("/api/membership-fees")
public class MembershipFeesController {

    // Wstrzykiwanie zależności dla MembershipFeesService
    private final MembershipFeesService membershipFeesService;

    // Konstruktor do wstrzykiwania zależności
    public MembershipFeesController(MembershipFeesService membershipFeesService) {
        this.membershipFeesService = membershipFeesService;
    }

    @GetMapping
    public ResponseEntity<List<MembershipFeesResponse>> getMembershipFeesForCurrentUser(Authentication authentication) {
        String login = authentication.getName();
        return ResponseEntity.ok(membershipFeesService.getMembershipFeesByFirefighter(login));
    }

}
