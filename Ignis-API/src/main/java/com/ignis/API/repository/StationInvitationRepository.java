package com.ignis.API.repository;

import org.springframework.stereotype.Repository;

import com.ignis.API.entity.StationInvitation;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface StationInvitationRepository extends JpaRepository<StationInvitation, Long> {

    Optional<StationInvitation> findByToken(String token);
}
