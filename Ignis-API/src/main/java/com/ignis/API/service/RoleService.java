package com.ignis.API.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ignis.API.entity.Role;
import com.ignis.API.repository.RoleRepository;

@Service
public class RoleService {

    private final RoleRepository roleRepository;

    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

}
