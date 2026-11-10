package com.ignis.API.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.ignis.API.dto.request.CreateFireStationRequest;
import com.ignis.API.dto.response.FireStationResponse;
import com.ignis.API.entity.FireStation;
import com.ignis.API.repository.FireStationRepository;

@Service
@Transactional(readOnly = true)
public class FireStationService {

    private final FireStationRepository fireStationRepository;

    public FireStationService(
            FireStationRepository fireStationRepository
    ) {
        this.fireStationRepository = fireStationRepository;
    }

    public List<FireStationResponse> getAllFireStations() {
        return fireStationRepository
                .findAllByOrderByNameAsc()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public FireStationResponse createFireStation(
            CreateFireStationRequest request
    ) {
        String normalizedName = request.name().trim();

        if (fireStationRepository
                .existsByNameIgnoreCase(normalizedName)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Jednostka o podanej nazwie już istnieje"
            );
        }

        FireStation fireStation = new FireStation(
                normalizedName,
                request.establishmentDate()
        );

        FireStation savedFireStation
                = fireStationRepository.save(fireStation);

        return mapToResponse(savedFireStation);
    }

    private FireStationResponse mapToResponse(
            FireStation fireStation
    ) {
        return new FireStationResponse(
                fireStation.getId(),
                fireStation.getName(),
                fireStation.getEstablishmentDate()
        );
    }
}
