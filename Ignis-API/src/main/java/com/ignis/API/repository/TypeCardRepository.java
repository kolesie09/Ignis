package com.ignis.API.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ignis.API.entity.TypeCard;

public interface TypeCardRepository extends JpaRepository<TypeCard, Long> {

    Optional<TypeCard> findByName(String name);
}
