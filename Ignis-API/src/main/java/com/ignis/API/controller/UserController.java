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
import com.ignis.API.service.UserService;
import com.ignis.API.dto.request.CreateUserRequest;
import com.ignis.API.dto.response.CreateUserResponse;

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
    @PreAuthorize("hasRole('ADMIN')") // Tylko użytkownicy z rolą ADMIN mogą tworzyć nowych użytkowników
    public ResponseEntity<CreateUserResponse> createUser(@RequestBody CreateUserRequest request) {
        CreateUserResponse response = userService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {

        LoginResponse loginResponse = userService.login(
                loginRequest.getLogin(),
                loginRequest.getPassword()
        );
        return ResponseEntity.ok(loginResponse);
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
