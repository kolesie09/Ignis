package com.ignis.API.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.ignis.API.dto.LoginRequest;
import com.ignis.API.entity.User;
import com.ignis.API.service.UserService;

import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/users") // Główny adres dla tego kontrolera 🌐
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Ta adnotacja oznacza, że metoda reaguje na żądania typu POST (tworzenie)
    @PostMapping
    public User createUser(@RequestBody User user) {
        // @RequestBody automatycznie tłumaczy JSON z Reacta na obiekt User w Javie
        return userService.createUser(user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        boolean isAuthenticated = userService.login(loginRequest.getLogin(), loginRequest.getPassword());

        if (isAuthenticated) {
            return ResponseEntity.ok("Zalogowano pomyślnie!");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Nieprawidłowy login lub hasło!");
        }
    }
}
