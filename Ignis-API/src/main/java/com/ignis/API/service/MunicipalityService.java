package com.ignis.API.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ignis.API.dto.response.MunicipalityResponse;
import com.ignis.API.repository.MunicipalityRepository;

@Service
public class MunicipalityService {

    private final MunicipalityRepository municipalityRepository;

    public MunicipalityService(MunicipalityRepository municipalityRepository) {
        this.municipalityRepository = municipalityRepository;
    }

    public List<MunicipalityResponse> getAllMunicipalities() {
        return municipalityRepository
                .findAll()
                .stream()
                .map(municipality -> new MunicipalityResponse(
                        municipality.getId(),
                        municipality.getName()
                ))
                .toList();
    }
}
