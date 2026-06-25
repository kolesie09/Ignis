package com.ignis.API.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ignis.API.entity.Roles;
import com.ignis.API.service.RoleService;

@RestController
@RequestMapping("/api/roles")
public class RoleController {

    private final RoleService rolesService;

    public RoleController(RoleService rolesService) {
        this.rolesService = rolesService;
    }

    @GetMapping
    public ResponseEntity<List<Roles>> getAllRoles() {
        List<Roles> roles = rolesService.getAllRoles();
        return ResponseEntity.ok(roles);
    }

}
