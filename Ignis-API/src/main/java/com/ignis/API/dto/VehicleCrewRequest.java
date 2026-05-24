package com.ignis.API.dto;

import java.util.List;

public class VehicleCrewRequest {

    private Integer vehicleId;
    private Integer driverId;
    private Integer commanderId;
    private List<Integer> firefighterIds;

    public Integer getVehicleId() {
        return vehicleId;
    }

    public Integer getDriverId() {
        return driverId;
    }

    public Integer getCommanderId() {
        return commanderId;
    }

    public List<Integer> getFirefighterIds() {
        return firefighterIds;
    }

    public void setVehicleId(Integer vehicleId) {
        this.vehicleId = vehicleId;
    }

    public void setDriverId(Integer driverId) {
        this.driverId = driverId;
    }

    public void setCommanderId(Integer commanderId) {
        this.commanderId = commanderId;
    }

    public void setFirefighterIds(List<Integer> firefighterIds) {
        this.firefighterIds = firefighterIds;
    }
}
