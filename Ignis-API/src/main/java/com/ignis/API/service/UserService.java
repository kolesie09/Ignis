package com.ignis.API.service;

import java.util.List;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.ignis.API.entity.Role;
import com.ignis.API.entity.User;
import com.ignis.API.repository.UserRepository;
import com.ignis.API.security.JwtService;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    // Spring automatycznie "wstrzyknie" tutaj nasze repozytorium
    public UserService(UserRepository userRepository, JwtService jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    // Prosta metoda do zapisu użytkownika w bazie
    public User createUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email jest już zajęty!");
        }

        // 1.Pobieramy surowe hasło z obiektu user
        String rawPassword = user.getPassword();

        // 2.Hashujemy hasło za pomocą BCrypt
        String encodedPassword = passwordEncoder.encode(rawPassword);

        // 3.Ustawiamy zahashowane hasło w obiekcie user
        user.setPassword(encodedPassword);

        return userRepository.save(user);
    }

    public User getUserByLogin(String login) {
        return userRepository.findByLogin(login)
                .orElseThrow(() -> new RuntimeException("Użytkownik nie znaleziony!"));
    }

    public String login(String login, String password) {
        User user = getUserByLogin(login);
        List<String> roles = user.getRoles()
                .stream()
                .map(Role::getName)
                .toList();

        if (!passwordEncoder.matches(password, user.getPassword())) {
            return null;
        }

        return jwtService.generateToken(user.getLogin(), roles);
    }
}
