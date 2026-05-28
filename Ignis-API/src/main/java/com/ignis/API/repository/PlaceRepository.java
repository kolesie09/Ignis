package com.ignis.API.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ignis.API.entity.City;
import com.ignis.API.entity.Place;
import com.ignis.API.entity.Street;

public interface PlaceRepository extends JpaRepository<Place, Long> {

    Optional<Place> findByCityAndStreet(City city, Street street);

    Optional<Place> findByCityAndStreetIsNull(City city);
}
