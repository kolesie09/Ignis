package com.ignis.API.service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.http.HttpStatus;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.ignis.API.dto.request.RegisterByInvitationRequest;
import com.ignis.API.entity.FireStation;
import com.ignis.API.entity.Firefighter;
import com.ignis.API.entity.StationInvitation;
import com.ignis.API.repository.FireStationRepository;
import com.ignis.API.repository.FirefighterRepository;
import com.ignis.API.repository.StationInvitationRepository;

@Service
@Transactional(readOnly = true)
public class StationInvitationService {

    private final StationInvitationRepository stationInvitationRepository;
    private final FirefighterRepository firefighterRepository;
    private final UserService userService;

    private final FireStationRepository fireStationRepository;

    public StationInvitationService(StationInvitationRepository stationInvitationRepository, FirefighterRepository firefighterRepository, UserService userService, FireStationRepository fireStationRepository) {
        this.stationInvitationRepository = stationInvitationRepository;
        this.firefighterRepository = firefighterRepository;
        this.userService = userService;

        this.fireStationRepository = fireStationRepository;
    }

    @Transactional
    public String createInvitation(String login, int validDays, Long fireStationId, boolean isSuperAdmin) {

        if (validDays <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Liczba dni ważności musi być większa od zera.");
        } else if (validDays > 30) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Liczba dni ważności nie może przekraczać 30 dni.");
        } else {

            Firefighter adminFirefighter = firefighterRepository.findByUserLogin(login)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Nie znaleziono użytkownika o loginie: " + login));

            LocalDateTime expiresAt = LocalDateTime.now().plusDays(validDays);
            String token = UUID.randomUUID().toString();

            FireStation fireStation;
            if (fireStationId != null) {
                if (!isSuperAdmin) {
                    throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Nie masz uprawnień do wyboru jednostki");
                }
                fireStation = fireStationRepository.findById(fireStationId)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Nie znaleziono danej jednostki"));
            } else {
                fireStation = adminFirefighter.getFireStation();
            }

            StationInvitation invitation = new StationInvitation(token, fireStation, adminFirefighter.getUser(), expiresAt);
            stationInvitationRepository.save(invitation);

            return token;
        }

    }

    @Transactional
    public void registerByInvitation(RegisterByInvitationRequest request) {
        StationInvitation invitation = stationInvitationRepository.findByToken(request.token())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Nie znaleziono zaproszenia"));

        if (invitation.isRevoked()) {
            throw new ResponseStatusException(HttpStatus.GONE, "Zaproszenie zostało unieważnione");
        }
        if (invitation.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.GONE, "Zaproszenie wygasło");
        }

        userService.registerPendingUser(request, invitation.getFireStation());

    }
}
