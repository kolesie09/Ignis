package com.ignis.API.dto.response;

import java.time.LocalDate;
import java.util.Set;

public record CreateUserResponse(
        // ID konta użytkownika
        Long userId,
        //Dane konta użytkownika
        String login,
        String email,
        //Dane osobowe strażaka
        String name,
        String lastName,
        LocalDate dateOfBirth,
        String nick,
        Set<String> roles) {

}
