package com.ignis.API.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ignis.API.dto.request.DepartureCardRequest;
import com.ignis.API.dto.response.DepartureCardDetailsResponse;
import com.ignis.API.dto.response.DepartureCardHistoryResponse;
import com.ignis.API.dto.response.DepartureCardResponse;
import com.ignis.API.service.DepartureCardService;

@RestController
@RequestMapping("/api/departure-cards")
public class DepartureCardController {

    private final DepartureCardService departureCardService;

    public DepartureCardController(DepartureCardService departureCardService) {
        this.departureCardService = departureCardService;
    }

    @PostMapping
    public ResponseEntity<DepartureCardResponse> createDepartureCard(
            @RequestBody DepartureCardRequest request,
            Authentication authentication
    ) {
        String login = authentication.getName();

        return ResponseEntity.ok(
                departureCardService.createDepartureCard(request, login)
        );
    }

    @GetMapping
    public ResponseEntity<List<DepartureCardHistoryResponse>> getCardHistory() {
        return ResponseEntity.ok(departureCardService.getCardHistory());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DepartureCardDetailsResponse> getCardDetails(@PathVariable Long id) {
        return ResponseEntity.ok(departureCardService.getCardDetails(id));
    }

    @PostMapping("/{id}/revision")
    public ResponseEntity<DepartureCardResponse> createCardRevision(@PathVariable("id") Long parentCardId, @RequestBody DepartureCardRequest request, Authentication authentication) {
        // Pobierz login użytkownika z obiektu Authentication
        String login = authentication.getName();
        // Wywołaj metodę serwisu, przekazując login użytkownika
        DepartureCardResponse response = departureCardService.createCardRevision(parentCardId, request, login);

        return ResponseEntity.ok(response);

    }

}
