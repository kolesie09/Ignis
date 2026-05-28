package com.ignis.API.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ignis.API.dto.request.CreateStreetRequest;
import com.ignis.API.dto.response.StreetResponse;
import com.ignis.API.entity.City;
import com.ignis.API.entity.Firefighter;
import com.ignis.API.entity.Street;
import com.ignis.API.exception.DuplicateResourceException;
import com.ignis.API.repository.CityRepository;
import com.ignis.API.repository.FirefighterRepository;
import com.ignis.API.repository.StreetRepository;

@Service
public class StreetService {

    private final StreetRepository streetRepository;
    private final CityRepository cityRepository;
    private final FirefighterRepository firefighterRepository;

    public StreetService(
            StreetRepository streetRepository,
            CityRepository cityRepository,
            FirefighterRepository firefighterRepository
    ) {
        this.streetRepository = streetRepository;
        this.cityRepository = cityRepository;
        this.firefighterRepository = firefighterRepository;
    }

    public List<StreetResponse> getStreetsByCity(Long cityId) {
        City city = cityRepository.findById(cityId)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono miasta o ID: " + cityId));

        return streetRepository.findByCity(city)
                .stream()
                .map(street -> new StreetResponse(
                street.getId(),
                street.getName()
        ))
                .toList();
    }

    public StreetResponse createStreet(String login, CreateStreetRequest request) {

        // Pobierz strażaka na podstawie loginu
        Firefighter firefighter = firefighterRepository.findByUserLogin(login)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono strażaka dla użytkownika: " + login));

        // Pobierz miasto na podstawie ID z requestu
        City city = cityRepository.findById(request.getCityId())
                .orElseThrow(() -> new RuntimeException("Nie znaleziono miasta o ID: " + request.getCityId()));

        // Sprawdź, czy ulica o tej samej nazwie już istnieje w danym mieście
        streetRepository.findByNameAndCity(request.getName(), city)
                .ifPresent(street -> {
                    throw new DuplicateResourceException("Ulica już istnieje: " + request.getName());

                });

        // Utwórz nową ulicę
        Street street = new Street(
                request.getName(),
                city,
                firefighter
        );

        // Zapisz ulicę w bazie danych
        Street savedStreet = streetRepository.save(street);

        // Zwróć odpowiedź z danymi nowo utworzonej ulicy
        return new StreetResponse(
                savedStreet.getId(),
                savedStreet.getName()
        );
    }
}
