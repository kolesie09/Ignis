package com.ignis.API.entity; // Tu wpisz swój główny pakiet

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "user")
@Getter
@Setter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String login;
    private String password;
    private String email;
    private String name;
    private String lastname;
    private LocalDate dateOfBirth;

    // Tutaj później wygenerujesz gettery i settery
}
