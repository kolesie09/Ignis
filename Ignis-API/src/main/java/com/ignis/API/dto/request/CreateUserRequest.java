package com.ignis.API.dto.request;

import java.time.LocalDate;
import java.util.Set;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateUserRequest {

    //Dane do logowania
    @NotBlank(message = "Login jest wymagany")
    private String login;
    @NotBlank(message = "Hasło jest wymagane")
    private String password;

    //Podstawowe dane użytkownika
    @NotBlank(message = "Email jest wymagany")
    @Email(message = "Nieprawidłowy format email")
    private String email;
    @NotBlank(message = "Imię jest wymagane")
    private String name;
    @NotBlank(message = "Nazwisko jest wymagane")
    private String lastName;

    private LocalDate dateOfBirth;

    private String nick;

    @NotEmpty(message = "Identyfikator ról jest wymagany")
    private Set<Long> roleIds;

    @NotNull(message = "Identyfikator statusu strażaka jest wymagany")
    private Long firefighterStatusId;

}
