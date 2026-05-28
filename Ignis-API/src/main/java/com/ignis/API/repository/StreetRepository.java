package com.ignis.API.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ignis.API.entity.City;
import com.ignis.API.entity.Street;

public interface StreetRepository extends JpaRepository<Street, Long> {

    List<Street> findByCity(City city);

    Optional<Street> findByNameAndCity(String name, City city);

}
