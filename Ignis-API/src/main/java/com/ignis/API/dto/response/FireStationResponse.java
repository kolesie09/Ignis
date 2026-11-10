package com.ignis.API.dto.response;

import java.time.LocalDate;

public record FireStationResponse(
        Long id,
        String name,
        LocalDate establishmentDate
        ) {

}
