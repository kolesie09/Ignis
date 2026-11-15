package com.ignis.API.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record RegisterByInvitationRequest(
        @NotBlank(message = "Login jest wymagany")
        String login,
        @NotBlank(message = "Hasło jest wymagane")
        String password,
        @NotBlank(message = "Email jest wymagany")
        @Email(message = "Nieprawidłowy format email")
        String email,
        @NotBlank(message = "Imię jest wymagane")
        String name,
        @NotBlank(message = "Nazwisko jest wymagane")
        String lastName,
        @NotBlank(message = "Token jest wymagany")
        String token
        ) {

}
