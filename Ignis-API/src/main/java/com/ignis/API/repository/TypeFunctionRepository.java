package com.ignis.API.repository;

import com.ignis.API.entity.TypeFunction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TypeFunctionRepository extends JpaRepository<TypeFunction, Integer> {

    Optional<TypeFunction> findByName(String name);
}
