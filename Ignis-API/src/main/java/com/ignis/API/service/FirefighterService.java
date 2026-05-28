package com.ignis.API.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ignis.API.dto.response.FirefighterResponse;
import com.ignis.API.entity.Firefighter;
import com.ignis.API.entity.Role;
import com.ignis.API.entity.User;
import com.ignis.API.exception.ResourceNotFoundException;
import com.ignis.API.repository.FirefighterRepository;

@Service
public class FirefighterService {

    private final FirefighterRepository firefighterRepository;

    public FirefighterService(FirefighterRepository firefighterRepository) {
        this.firefighterRepository = firefighterRepository;
    }

    private FirefighterResponse mapToResponse(Firefighter firefighter) {
        User user = firefighter.getUser();

        List<String> roles = user.getRoles()
                .stream()
                .map(Role::getName)
                .toList();

        String nick = buildNick(user, firefighter.getId());

        return new FirefighterResponse(
                firefighter.getId(),
                user.getLogin(),
                user.getName(),
                user.getLastname(),
                user.getEmail(),
                firefighter.getFirefighterStatus().getName(),
                firefighter.getFireStation().getName(),
                roles,
                nick
        );
    }

    private String buildNick(User user, Long firefighterId) {
        if (user == null) {
            return "Strażak " + firefighterId;
        }

        if (user.getNick() != null && !user.getNick().isBlank()) {
            return user.getNick();
        }

        String firstName = user.getName() == null ? "" : user.getName();
        String lastname = user.getLastname() == null ? "" : user.getLastname();

        if (!firstName.isBlank() && !lastname.isBlank()) {
            return lastname + " " + firstName.charAt(0);
        }

        String fullName = (firstName + " " + lastname).trim();

        if (!fullName.isBlank()) {
            return fullName;
        }

        return "Strażak " + firefighterId;
    }

    public List<FirefighterResponse> getAllFirefighters() {
        return firefighterRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public FirefighterResponse getFirefighterById(Long id) {
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
