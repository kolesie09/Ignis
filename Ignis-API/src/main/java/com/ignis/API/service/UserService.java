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

import com.ignis.API.dto.request.CreateUserRequest;
import com.ignis.API.dto.response.CreateUserResponse;
import com.ignis.API.exception.DuplicateResourceException;
import com.ignis.API.repository.FirefighterRepository;
import com.ignis.API.repository.FirefighterStatusRepository;
import com.ignis.API.repository.RoleRepository;

import java.util.HashSet;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

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

    // Prosta metoda do zapisu użytkownika w bazie
    @Transactional
    public CreateUserResponse createUser(CreateUserRequest request, String adminLogin) {
        if (userRepository.existsByLogin(request.getLogin())) {
            throw new DuplicateResourceException("Login jest już zajęty!");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email jest już zajęty!");
        }

        FireStation adminStation = firefighterRepository.findByUserLogin(adminLogin)
                .orElseThrow(() -> new ResourceNotFoundException("Nie znaleziono strażaka dla użytkownika: " + adminLogin))
                .getFireStation();

        // 1.Pobieramy surowe hasło z obiektu user
        String rawPassword = request.getPassword();

        // 2.Hashujemy hasło za pomocą BCrypt
        String encodedPassword = passwordEncoder.encode(rawPassword);

        List<Role> roles = roleRepository.findAllById(request.getRoleIds());

        if (roles.size() != request.getRoleIds().size()) {
            throw new ResourceNotFoundException("Nie znaleziono jednej lub więcej ról");
        }

        // 3.Ustawiamy zahashowane hasło w obiekcie user
        User user = new User(
                request.getLogin(),
                encodedPassword,
                request.getEmail(),
                request.getName(),
                request.getLastName(),
                request.getDateOfBirth(),
                request.getNick()
        );
        user.setRoles(new HashSet<>(roles));
        user.activate();

        FirefighterStatus firefighterStatus = firefighterStatusRepository.findById(request.getFirefighterStatusId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Nie znaleziono statusu strażaka o podanym ID"
                ));

        User savedUser = userRepository.save(user);

        firefighterRepository.save(new Firefighter(savedUser, firefighterStatus, adminStation));

        return new CreateUserResponse(
                savedUser.getId(),
                savedUser.getLogin(),
                savedUser.getEmail(),
                savedUser.getName(),
                savedUser.getLastName(),
                savedUser.getDateOfBirth(),
                savedUser.getNick(),
                savedUser.getRoles().stream().map(Role::getName).collect(Collectors.toSet())
        );
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
}
