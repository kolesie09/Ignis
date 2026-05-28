package com.ignis.API.dto.request;

import java.util.List;

public class VehicleCrewRequest {

    private Long vehicleId;
    private Long driverId;
    private Long commanderId;
    private List<Long> firefighterIds;

    public Long getVehicleId() {
        return vehicleId;
    }

    public Long getDriverId() {
        return driverId;
    }

    public Long getCommanderId() {
        return commanderId;
    }

    public List<Long> getFirefighterIds() {
        return firefighterIds;
    }

    public void setVehicleId(Long vehicleId) {
        this.vehicleId = vehicleId;
    }

    public void setDriverId(Long driverId) {
        this.driverId = driverId;
    }

    public void setCommanderId(Long commanderId) {
        this.commanderId = commanderId;
    }

    public void setFirefighterIds(List<Long> firefighterIds) {
        this.firefighterIds = firefighterIds;
    }
}
