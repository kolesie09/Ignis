package com.ignis.API.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ignis.API.dto.CityResponse;
import com.ignis.API.dto.CreateCityRequest;
import com.ignis.API.entity.City;
import com.ignis.API.entity.Firefighter;
import com.ignis.API.exception.DuplicateResourceException;
import com.ignis.API.repository.CityRepository;
import com.ignis.API.repository.FirefighterRepository;

@Service
public class CityService {

    private final CityRepository cityRepository;
    private final FirefighterRepository firefighterRepository;

    public CityService(
            CityRepository cityRepository,
            FirefighterRepository firefighterRepository
    ) {
        this.cityRepository = cityRepository;
        this.firefighterRepository = firefighterRepository;
    }

    public List<CityResponse> getCitiesForCurrentUser(String login) {
        Firefighter firefighter = firefighterRepository.findByUserLogin(login)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono strażaka dla użytkownika: " + login));

        return cityRepository.findByFireStation(firefighter.getFireStation())
                .stream()
                .map(city -> new CityResponse(
                city.getId(),
                city.getName()
        ))
                .toList();
    }

    public CityResponse createCity(String login, CreateCityRequest request) {
        Firefighter firefighter = firefighterRepository.findByUserLogin(login)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono strażaka dla użytkownika: " + login));

        cityRepository.findByNameAndFireStation(request.getName(), firefighter.getFireStation())
                .ifPresent(city -> {
                    throw new DuplicateResourceException("Miasto już istnieje: " + request.getName());
                });

        City city = new City(
                request.getName(),
                firefighter.getFireStation(),
                firefighter
        );

        City savedCity = cityRepository.save(city);

        return new CityResponse(
                savedCity.getId(),
                savedCity.getName()
        );
    }
}
