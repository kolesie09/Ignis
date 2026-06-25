package com.ignis.API.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ignis.API.entity.Firefighter;
import com.ignis.API.entity.MembershipFees;

@Repository
public interface MembershipFeesRepository extends JpaRepository<MembershipFees, Long> {

    List<MembershipFees> findByFirefighter(Firefighter firefighter);

    Optional<MembershipFees> findByFirefighterId(Long firefighterId);

}
