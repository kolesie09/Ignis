package com.ignis.API.service;

import java.util.List;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.ignis.API.dto.response.LoginResponse;
import com.ignis.API.entity.FireStation;
import com.ignis.API.entity.Firefighter;
import com.ignis.API.entity.FirefighterStatus;
import com.ignis.API.entity.Role;
import com.ignis.API.entity.User;
import com.ignis.API.repository.UserRepository;
import com.ignis.API.security.JwtService;

import org.springframework.transaction.annotation.Transactional;

import com.ignis.API.exception.DuplicateResourceException;
import com.ignis.API.repository.FirefighterRepository;
import com.ignis.API.repository.FirefighterStatusRepository;
import com.ignis.API.repository.RoleRepository;

import java.util.HashSet;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import com.ignis.API.dto.request.RegisterByInvitationRequest;
import com.ignis.API.exception.InvalidCredentialsException;
import com.ignis.API.exception.ResourceNotFoundException;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RoleRepository roleRepository;
    private static final String INVALID_CREDENTIALS = "Nieprawidłowe dane logowania!";

    private final FirefighterRepository firefighterRepository;
    private final FirefighterStatusRepository firefighterStatusRepository;

    // Spring automatycznie "wstrzyknie" tutaj nasze repozytorium
    public UserService(UserRepository userRepository, JwtService jwtService, RoleRepository roleRepository, FirefighterRepository firefighterRepository, FirefighterStatusRepository firefighterStatusRepository) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = new BCryptPasswordEncoder();
        this.roleRepository = roleRepository;
        this.firefighterRepository = firefighterRepository;
        this.firefighterStatusRepository = firefighterStatusRepository;
    }

    public User getUserByLogin(String login) {
        return userRepository.findByLogin(login)
                .orElseThrow(() -> new RuntimeException("Użytkownik nie znaleziony!"));
    }

    public LoginResponse login(String login, String password) {

        User user = userRepository.findByLogin(login)
                .orElseThrow(() -> new InvalidCredentialsException(INVALID_CREDENTIALS));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new InvalidCredentialsException(INVALID_CREDENTIALS);
        }

        if (!user.isActive()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Konto użytkownika czeka na akceptację administratora.");
        }

        List<String> roles = user.getRoles()
                .stream()
                .map(Role::getName)
                .toList();

        String token = jwtService.generateToken(user.getLogin(), roles);

        return new LoginResponse(token, roles);
    }

    @Transactional
    public void registerPendingUser(RegisterByInvitationRequest request, FireStation fireStation) {
        if (userRepository.existsByLogin(request.login())) {
            throw new DuplicateResourceException("Login jest już zajęty!");
        }

        if (userRepository.existsByEmail(request.email())) {
            throw new DuplicateResourceException("Email jest już zajęty!");
        }

        String encodedPassword = passwordEncoder.encode(request.password());

        User user = new User(request.login(), encodedPassword, request.email(), request.name(), request.lastName(), null, null);

        user.setNick(makeNickUniqueInStation(user.getNick(), fireStation.getId()));

        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new IllegalStateException("Brak roli ROLE_USER w bazie"));
        user.getRoles().add(userRole);

        User savedUser = userRepository.save(user);

        FirefighterStatus status = firefighterStatusRepository.findByName("Kandydat")
                .orElseThrow(() -> new IllegalStateException("Brak statusu Kandydat w bazie"));

        firefighterRepository.save(new Firefighter(savedUser, status, fireStation));

    }

    private String makeNickUniqueInStation(String baseNick, Long fireStationId) {
        String candidate = baseNick;
        int counter = 2;
        while (firefighterRepository.existsByFireStationIdAndUserNick(fireStationId, candidate)) {
            candidate = baseNick + " " + counter;
            counter++;
        }

        return candidate;
    }

}
