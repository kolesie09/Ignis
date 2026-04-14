package com.ignis.API.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.ignis.API.entity.User;
import com.ignis.API.repository.UserRepository;

import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    // Spring automatycznie "wstrzyknie" tutaj nasze repozytorium
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
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

    public boolean login(String login, String password) {
        User user = getUserByLogin(login);
        return passwordEncoder.matches(password, user.getPassword());
    }
}
