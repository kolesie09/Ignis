package com.ignis.API.dto;

public class IncidentRequest {

    private String name;
    private Integer incidentTypeId;

    public String getName() {
        return name;
    }

    public Integer getIncidentTypeId() {
        return incidentTypeId;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setIncidentTypeId(Integer incidentTypeId) {
        this.incidentTypeId = incidentTypeId;
    }
}
