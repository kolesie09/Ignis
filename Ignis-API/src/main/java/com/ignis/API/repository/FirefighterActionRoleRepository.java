package com.ignis.API.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ignis.API.entity.FirefighterActionRole;

public interface FirefighterActionRoleRepository extends JpaRepository<FirefighterActionRole, Long> {

    List<FirefighterActionRole> findByVehicleToCardId(Long vehicleToCardId);
}
