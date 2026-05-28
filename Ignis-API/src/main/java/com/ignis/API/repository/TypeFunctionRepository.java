package com.ignis.API.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ignis.API.entity.TypeFunction;

public interface TypeFunctionRepository extends JpaRepository<TypeFunction, Long> {

    Optional<TypeFunction> findByName(String name);
}
