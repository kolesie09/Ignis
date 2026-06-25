package com.ignis.API.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ignis.API.dto.response.MembershipFeesResponse;
import com.ignis.API.entity.Firefighter;
import com.ignis.API.exception.ResourceNotFoundException;
import com.ignis.API.repository.FirefighterRepository;
import com.ignis.API.repository.MembershipFeesRepository;

@Service
public class MembershipFeesService {

    private final FirefighterRepository firefighterRepository;
    private final MembershipFeesRepository membershipFeesRepository;

    public MembershipFeesService(FirefighterRepository firefighterRepository, MembershipFeesRepository membershipFeesRepository) {
        this.firefighterRepository = firefighterRepository;
        this.membershipFeesRepository = membershipFeesRepository;
    }

    public List<MembershipFeesResponse> getMembershipFeesByFirefighter(String login) {

        Firefighter firefighter = firefighterRepository.findByUserLogin(login)
                .orElseThrow(() -> new ResourceNotFoundException("Nie znaleziono strażaka o loginie: " + login));

        return membershipFeesRepository.findByFirefighter(firefighter)
                .stream()
                .map(membershipFees -> new MembershipFeesResponse(
                membershipFees.getId(),
                membershipFees.getYear(),
                membershipFees.getPriceMembershipFees().getPrice(),
                membershipFees.getDateOfPayment(),
                membershipFees.getStatusPayment()
        ))
                .toList();
    }
}
