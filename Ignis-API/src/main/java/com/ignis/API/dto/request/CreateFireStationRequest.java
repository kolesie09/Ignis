package com.ignis.API.dto.request;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;

public record CreateFireStationRequest(
        @NotBlank(message = "Nazwa jednostki jest wymagana")
        @Size(
                max = 255,
                message = "Nazwa jednostki może mieć maksymalnie 255 znaków"
        )
        String name,
        @PastOrPresent(
                message = "Data założenia nie może być datą przyszłą"
        )
        LocalDate establishmentDate,
        @NotNull(message = "Gmina jest wymagana")
        Long municipalityId
        ) {

}
