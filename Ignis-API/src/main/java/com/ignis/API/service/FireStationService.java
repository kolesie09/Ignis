package com.ignis.API.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.ignis.API.dto.request.CreateFireStationRequest;
import com.ignis.API.dto.response.FireStationResponse;
import com.ignis.API.dto.response.MunicipalityResponse;
import com.ignis.API.entity.FireStation;
import com.ignis.API.entity.Municipality;
import com.ignis.API.repository.FireStationRepository;
import com.ignis.API.repository.MunicipalityRepository;

// @Service – Spring sam tworzy jeden obiekt tej klasy (bean) i wstrzykuje go tam,
// gdzie jest potrzebny (np. do FireStationController).
@Service
// Domyślnie każda metoda działa w transakcji TYLKO DO ODCZYTU.
// Metody, które zapisują dane, nadpisują to własnym @Transactional (patrz niżej).
@Transactional(readOnly = true)
public class FireStationService {

    // Repozytoria = dostęp do tabel w bazie. "final" – ustawiane raz, w konstruktorze.
    private final FireStationRepository fireStationRepository;
    private final MunicipalityRepository municipalityRepository;

    // Wstrzykiwanie zależności przez konstruktor: Spring widzi parametry
    // i sam podaje tu gotowe repozytoria.
    public FireStationService(
            FireStationRepository fireStationRepository,
            MunicipalityRepository municipalityRepository
    ) {
        this.fireStationRepository = fireStationRepository;
        this.municipalityRepository = municipalityRepository;
    }

    // Zwraca wszystkie jednostki posortowane alfabetycznie po nazwie.
    public List<FireStationResponse> getAllFireStations() {
        return fireStationRepository
                .findAllByOrderByNameAsc() // Spring generuje zapytanie SQL z samej nazwy metody
                .stream() // zamiana listy na strumień, żeby móc ją przekształcić
                .map(this::mapToResponse) // każdą encję FireStation zamieniamy na DTO
                .toList();                   // z powrotem do listy
    }

    // Tworzy nową jednostkę OSP przypisaną do gminy.
    // @Transactional (bez readOnly) – ta metoda ZAPISUJE do bazy.
    // Jeśli w środku poleci wyjątek, wszystkie zmiany zostaną wycofane (rollback).
    @Transactional
    public FireStationResponse createFireStation(
            CreateFireStationRequest request
    ) {
        // Usuwamy spacje z początku i końca nazwy, np. " OSP Barlinek " -> "OSP Barlinek".
        String normalizedName = request.name().trim();

        // Nazwa musi być unikalna (bez względu na wielkość liter).
        // Jeśli już istnieje -> 409 CONFLICT.
        if (fireStationRepository
                .existsByNameIgnoreCase(normalizedName)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Jednostka o podanej nazwie już istnieje"
            );
        }

        // Szukamy gminy po ID przysłanym z frontu.
        // findById zwraca Optional ("pudełko", które może być puste).
        // orElseThrow: jest gmina -> wyjmij ją; brak -> 400 BAD_REQUEST
        // (błąd w danych od klienta, a nie brak adresu, więc nie 404).
        Municipality municipality = municipalityRepository.findById(request.municipalityId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Gmina o podanym ID nie istnieje"
                ));

        // Tworzymy encję. Gmina jest w konstruktorze, więc nie da się
        // zrobić jednostki bez gminy (kompilator by nie pozwolił).
        FireStation fireStation = new FireStation(
                normalizedName,
                request.establishmentDate(),
                municipality
        );

        // save() robi INSERT do bazy i zwraca encję z nadanym ID.
        FireStation savedFireStation
                = fireStationRepository.save(fireStation);

        // Na zewnątrz oddajemy DTO, nigdy samą encję.
        return mapToResponse(savedFireStation);
    }

    // Pomocnicza metoda: encja (obiekt bazodanowy) -> DTO (to, co widzi frontend).
    // Dzięki temu sami decydujemy, które pola wychodzą z API.
    private FireStationResponse mapToResponse(
            FireStation fireStation
    ) {
        return new FireStationResponse(
                fireStation.getId(),
                fireStation.getName(),
                fireStation.getEstablishmentDate(),
                new MunicipalityResponse(
                        fireStation.getMunicipality().getId(),
                         fireStation.getMunicipality().getName()
                )
        );
    }
}
