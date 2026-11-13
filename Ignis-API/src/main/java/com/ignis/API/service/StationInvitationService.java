package com.ignis.API.service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.ignis.API.entity.Firefighter;
import com.ignis.API.entity.StationInvitation;
import com.ignis.API.repository.FirefighterRepository;
import com.ignis.API.repository.StationInvitationRepository;

@Service
@Transactional(readOnly = true)
public class StationInvitationService {

    private final StationInvitationRepository stationInvitationRepository;
    private final FirefighterRepository firefighterRepository;

    public StationInvitationService(StationInvitationRepository stationInvitationRepository, FirefighterRepository firefighterRepository) {
        this.stationInvitationRepository = stationInvitationRepository;
        this.firefighterRepository = firefighterRepository;
    }

    @Transactional
    public String createInvitation(String login, int validDays) {

        if (validDays <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Liczba dni ważności musi być większa od zera.");
        } else if (validDays > 30) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Liczba dni ważności nie może przekraczać 30 dni.");
        } else {

            Firefighter adminFirefighter = firefighterRepository.findByUserLogin(login)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Nie znaleziono użytkownika o loginie: " + login));

            LocalDateTime expiresAt = LocalDateTime.now().plusDays(validDays);
            String token = UUID.randomUUID().toString();

            StationInvitation invitation = new StationInvitation(token, adminFirefighter.getFireStation(), adminFirefighter.getUser(), expiresAt);
            stationInvitationRepository.save(invitation);

            return token;
        }

    }
}
