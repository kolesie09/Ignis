package com.ignis.API.dto.request;

import java.time.LocalDate;
import java.util.Set;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateUserRequest {

    //Dane do logowania
    private String login;
    private String password;

    //Podstawowe dane użytkownika
    private String email;
    private String name;
    private String lastName;

    private LocalDate dateOfBirth;

    private String nick;

    private Set<Long> roleIds;

    private Long firefighterStatusId;

}
