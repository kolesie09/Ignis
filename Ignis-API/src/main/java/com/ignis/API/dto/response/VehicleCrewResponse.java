package com.ignis.API.dto.response;

import java.util.List;

public class VehicleCrewResponse {

    private Long vehicleToCardId;
    private Long vehicleId;
    private String operationalName;
    private List<CrewMemberResponse> crew;

    public VehicleCrewResponse(Long vehicleToCardId, Long vehicleId, String operationalName, List<CrewMemberResponse> crew) {
        this.vehicleToCardId = vehicleToCardId;
        this.vehicleId = vehicleId;
        this.operationalName = operationalName;
        this.crew = crew;
    }

    public Long getVehicleToCardId() {
        return vehicleToCardId;
    }

    public Long getVehicleId() {
        return vehicleId;
    }

    public String getOperationalName() {
        return operationalName;
    }

    public List<CrewMemberResponse> getCrew() {
        return crew;
    }
}
