package com.ignis.API.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ignis.API.entity.City;
import com.ignis.API.entity.FireStation;

public interface CityRepository extends JpaRepository<City, Integer> {

    // Metoda do wyszukiwania miast według jednostki strażackiej
    List<City> findByFireStation(FireStation fireStation);

    // Metoda do wyszukiwania miasta według nazwy i jednostki strażackiej
    Optional<City> findByNameAndFireStation(String name, FireStation fireStation);
}
