package com.ignis.API.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ignis.API.entity.Card;

public interface CardRepository extends JpaRepository<Card, Integer> {
}
