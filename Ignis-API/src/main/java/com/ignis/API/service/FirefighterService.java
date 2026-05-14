package com.ignis.API.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ignis.API.entity.Firefighter;
import com.ignis.API.repository.FirefighterRepository;

@Service
public class FirefighterService {

    private final FirefighterRepository firefighterRepository;

    public FirefighterService(FirefighterRepository firefighterRepository) {
        this.firefighterRepository = firefighterRepository;
    }

    public List<Firefighter> getAllFirefighters() {
        return firefighterRepository.findAll();
    }
}
