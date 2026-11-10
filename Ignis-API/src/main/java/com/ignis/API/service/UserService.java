package com.ignis.API.service;

import java.util.List;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.ignis.API.dto.response.LoginResponse;
import com.ignis.API.entity.Role;
import com.ignis.API.entity.User;
import com.ignis.API.repository.UserRepository;
import com.ignis.API.security.JwtService;
import com.ignis.API.dto.request.CreateUserRequest;
import com.ignis.API.dto.response.CreateUserResponse;
import com.ignis.API.exception.DuplicateResourceException;
import com.ignis.API.repository.RoleRepository;

import java.util.HashSet;
import java.util.stream.Collectors;

import com.ignis.API.exception.ResourceNotFoundException;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RoleRepository roleRepository;

    // Spring automatycznie "wstrzyknie" tutaj nasze repozytorium
    public UserService(UserRepository userRepository, JwtService jwtService, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = new BCryptPasswordEncoder();
        this.roleRepository = roleRepository;
    }

    // Prosta metoda do zapisu użytkownika w bazie
    public CreateUserResponse createUser(CreateUserRequest request) {
        if (userRepository.existsByLogin(request.getLogin())) {
            throw new DuplicateResourceException("Login jest już zajęty!");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email jest już zajęty!");
        }

        // 1.Pobieramy surowe hasło z obiektu user
        String rawPassword = request.getPassword();

        // 2.Hashujemy hasło za pomocą BCrypt
        String encodedPassword = passwordEncoder.encode(rawPassword);

        List<Role> roles = roleRepository.findAllById(request.getRoleIds());

        if (roles.size() != request.getRoleIds().size()) {
            throw new ResourceNotFoundException("Nie znaleziono jednej lub więcej ról");
        }

        // 3.Ustawiamy zahashowane hasło w obiekcie user
        User user = new User();
        user.setLogin(request.getLogin());
        user.setEmail(request.getEmail());
        user.setPassword(encodedPassword);
        user.setName(request.getName());
        user.setLastName(request.getLastName());
        user.setDateOfBirth(request.getDateOfBirth());
        user.setNick(request.getNick());
        user.setRoles(new HashSet<>(roles));

        User savedUser = userRepository.save(user);

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

        User user = getUserByLogin(login);

        if (!passwordEncoder.matches(password, user.getPassword())) {
            return null;
        }

        List<String> roles = user.getRoles()
                .stream()
                .map(Role::getName)
                .toList();

        String token = jwtService.generateToken(user.getLogin(), roles);

        return new LoginResponse(token, roles);
    }
}
