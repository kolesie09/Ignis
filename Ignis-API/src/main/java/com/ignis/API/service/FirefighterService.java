package com.ignis.API.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ignis.API.dto.response.FirefighterResponse;
import com.ignis.API.entity.FireStation;
import com.ignis.API.entity.Firefighter;
import com.ignis.API.entity.Role;
import com.ignis.API.entity.User;
import com.ignis.API.exception.ResourceNotFoundException;
import com.ignis.API.repository.FireStationRepository;
import com.ignis.API.repository.FirefighterRepository;

@Service
public class FirefighterService {

    private final FirefighterRepository firefighterRepository;
    private final FireStationRepository fireStationRepository;

    public FirefighterService(FirefighterRepository firefighterRepository, FireStationRepository fireStationRepository) {
        this.firefighterRepository = firefighterRepository;
        this.fireStationRepository = fireStationRepository;
    }

    // Metoda pomocnicza do mapowania encji Firefighter na DTO FirefighterResponse
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
                user.getLastName(),
                user.getEmail(),
                firefighter.getFirefighterStatus().getName(),
                firefighter.getFireStation().getName(),
                roles,
                nick
        );
    }
// Metoda pomocnicza do budowania nicku strażaka

    private String buildNick(User user, Long firefighterId) {
        if (user == null) {
            return "Strażak " + firefighterId;
        }

        if (user.getNick() != null && !user.getNick().isBlank()) {
            return user.getNick();
        }

        String firstName = user.getName() == null ? "" : user.getName();
        String lastName = user.getLastName() == null ? "" : user.getLastName();

        if (!firstName.isBlank() && !lastName.isBlank()) {
            return lastName + " " + firstName.charAt(0);
        }

        String fullName = (firstName + " " + lastName).trim();

        if (!fullName.isBlank()) {
            return fullName;
        }

        return "Strażak " + firefighterId;
    }

    // Metoda do pobierania wszystkich strażaków
    public List<FirefighterResponse> getAllFirefighters() {
        return firefighterRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // Metoda do pobierania strażaka po ID
    public FirefighterResponse getFirefighterById(Long id) {
        Firefighter firefighter = firefighterRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Nie znaleziono strażaka o ID: " + id));

        return mapToResponse(firefighter);
    }

    // Metoda do pobierania strażaka na podstawie loginu użytkownika
    public FirefighterResponse getCurrentFirefighter(String login) {
        Firefighter firefighter = firefighterRepository.findByUserLogin(login)
                .orElseThrow(() -> new ResourceNotFoundException("Nie znaleziono strażaka dla użytkownika: " + login));

        return mapToResponse(firefighter);
    }

    // Metoda do pobierania strażaków przypisanych do jednostki OSP
    public List<FirefighterResponse> getFirefightersFromMyStation(String login) {
        Firefighter currentFirefighter = firefighterRepository.findByUserLogin(login)
                .orElseThrow(() -> new ResourceNotFoundException("Nie znaleziono strażaka dla użytkownika: " + login));

        Long fireStationId = currentFirefighter.getFireStation().getId();

        return firefighterRepository.findByFireStationId(fireStationId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }
}
