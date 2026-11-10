package com.ignis.API.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ignis.API.entity.FireStation;

@Repository
public interface FireStationRepository
        extends JpaRepository<FireStation, Long> {

    boolean existsByNameIgnoreCase(String name);

    List<FireStation> findAllByOrderByNameAsc();
}
