package com.ignis.API.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ignis.API.dto.request.ApproveFirefighterRequest;
import com.ignis.API.dto.response.FirefighterResponse;
import com.ignis.API.security.SecurityUtils;
import com.ignis.API.service.FirefighterService;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PutMapping;

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
        boolean isSuperAdmin = SecurityUtils.isSuperAdmin(authentication);
        return ResponseEntity.ok(firefighterService.getFirefighters(login, true, isSuperAdmin));
    }

    @GetMapping("/{id}")
    public ResponseEntity<FirefighterResponse> getFirefighterById(@PathVariable Long id, Authentication authentication) {
        boolean isSuperAdmin = SecurityUtils.isSuperAdmin(authentication);
        return ResponseEntity.ok(firefighterService.getFirefighterById(authentication.getName(), id, isSuperAdmin));
    }

    @GetMapping("/me")
    public ResponseEntity<FirefighterResponse> getCurrentFirefighter(Authentication authentication) {
        String login = authentication.getName();
        return ResponseEntity.ok(firefighterService.getCurrentFirefighter(login));
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<FirefighterResponse>> getPendingFirefighters(Authentication authentication) {
        boolean isSuperAdmin = SecurityUtils.isSuperAdmin(authentication);
        return ResponseEntity.ok(firefighterService.getFirefighters(authentication.getName(), false, isSuperAdmin));
    }

    @PatchMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> patchApproveCandidat(@PathVariable Long id, @Valid @RequestBody ApproveFirefighterRequest request, Authentication authentication) {
        Long statusId = request.firefighterStatusId();
        boolean isSuperAdmin = SecurityUtils.isSuperAdmin(authentication);
        firefighterService.approveFirefighter(id, statusId, authentication.getName(), isSuperAdmin);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/admin")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> putAdmin(@PathVariable Long id) {

        firefighterService.grantAdmin(id);

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}/admin")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> deleteAdmin(@PathVariable Long id) {

        firefighterService.revokeAdmin(id);

        return ResponseEntity.noContent().build();
    }
}
