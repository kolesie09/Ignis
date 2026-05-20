package com.ignis.API.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ignis.API.dto.FirefighterResponse;
import com.ignis.API.entity.Firefighter;
import com.ignis.API.entity.Role;
import com.ignis.API.exception.ResourceNotFoundException;
import com.ignis.API.repository.FirefighterRepository;

@Service
public class FirefighterService {

    private final FirefighterRepository firefighterRepository;

    public FirefighterService(FirefighterRepository firefighterRepository) {
        this.firefighterRepository = firefighterRepository;
    }

    private FirefighterResponse mapToResponse(Firefighter firefighter) {
        List<String> roles = firefighter.getUser().getRoles()
                .stream()
                .map(Role::getName)
                .toList();

        return new FirefighterResponse(
                firefighter.getId(),
                firefighter.getUser().getLogin(),
                firefighter.getUser().getName(),
                firefighter.getUser().getLastname(),
                firefighter.getUser().getEmail(),
                firefighter.getFirefighterStatus().getName(),
                firefighter.getFireStation().getName(),
                roles
        );
    }

    public List<FirefighterResponse> getAllFirefighters() {
        return firefighterRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public FirefighterResponse getFirefighterById(Integer id) {
        Firefighter firefighter = firefighterRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Nie znaleziono strażaka o ID: " + id));

        return mapToResponse(firefighter);
    }

    public FirefighterResponse getCurrentFirefighter(String login) {
        Firefighter firefighter = firefighterRepository.findByUserLogin(login)
                .orElseThrow(() -> new ResourceNotFoundException("Nie znaleziono strażaka dla użytkownika: " + login));

        return mapToResponse(firefighter);
    }
}
