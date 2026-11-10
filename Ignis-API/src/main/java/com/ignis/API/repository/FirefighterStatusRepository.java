package com.ignis.API.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ignis.API.entity.FirefighterStatus;

public interface FirefighterStatusRepository extends JpaRepository<FirefighterStatus, Long> {

    List<FirefighterStatus> findAllByOrderByNameAsc();
    //Teraz pkt 4 z chata 
}
