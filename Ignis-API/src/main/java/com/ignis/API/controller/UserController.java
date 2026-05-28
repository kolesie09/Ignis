package com.ignis.API.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ignis.API.dto.request.LoginRequest;
import com.ignis.API.dto.response.LoginResponse;
import com.ignis.API.entity.User;
import com.ignis.API.service.UserService;

@CrossOrigin(origins = "${app.cors.allowed-origin-patterns}")
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
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        String token = userService.login(loginRequest.getLogin(), loginRequest.getPassword());

        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Błędny login lub hasło");
        }

        return ResponseEntity.ok(new LoginResponse(token));
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Masz dostęp do chronionego endpointu");
    }

    @GetMapping("/admin-test")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> adminTest() {
        return ResponseEntity.ok("Masz dostęp jako ADMIN");
    }
}
