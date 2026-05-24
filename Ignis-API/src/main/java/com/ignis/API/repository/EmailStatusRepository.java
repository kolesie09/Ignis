package com.ignis.API.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ignis.API.entity.EmailStatus;

public interface EmailStatusRepository extends JpaRepository<EmailStatus, Integer> {

    Optional<EmailStatus> findByName(String name);
}
