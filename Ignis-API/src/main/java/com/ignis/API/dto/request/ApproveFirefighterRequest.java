package com.ignis.API.dto.request;

import jakarta.validation.constraints.NotNull;

public record ApproveFirefighterRequest(@NotNull(message = "Status strażaka jest wymagany")
        Long firefighterStatusId) {

}
