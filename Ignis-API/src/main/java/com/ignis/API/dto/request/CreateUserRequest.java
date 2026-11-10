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


    /*
     * Identyfikatory ról wybranych w formularzu.
     *
     * Przykład:
     * [1, 3]
     *
     * Może to oznaczać:
     * ROLE_MEMBER oraz ROLE_TREASURER.
     */
    private Set<Long> roleIds;

    /*
     * Identyfikator jednostki OSP.
     *
     * Przykład:
     * 1 → OSP Barlinek
     */
    private Long fireStationId;

    /*
     * Identyfikator statusu strażaka.
     *
     * Przykład:
     * 1 → czynny
     * 2 → wspierający
     */
    private Long firefighterStatusId;

}
