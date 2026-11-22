package com.ignis.API.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ignis.API.dto.response.FirefighterStatusResponse;
import com.ignis.API.entity.FirefighterStatus;
import com.ignis.API.repository.FirefighterRepository;
import com.ignis.API.repository.FirefighterStatusRepository;

@Service
public class FirefighterStatusService {

    private final FirefighterStatusRepository firefighterStatusRepository;

    public FirefighterStatusService(FirefighterStatusRepository firefighterStatusRepository) {
        this.firefighterStatusRepository = firefighterStatusRepository;
    }

    public List<FirefighterStatusResponse> getAllFirefighterStatus() {
        return firefighterStatusRepository
                .findAll()
                .stream()
                .map(firefighterStatus -> new FirefighterStatusResponse(
                        firefighterStatus.getId(),
                        firefighterStatus.getName()))
                .toList();
    }

}
