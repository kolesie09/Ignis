package com.ignis.API.dto.request;

public class IncidentRequest {

    private String name;
    private Long incidentTypeId;

    public String getName() {
        return name;
    }

    public Long getIncidentTypeId() {
        return incidentTypeId;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setIncidentTypeId(Long incidentTypeId) {
        this.incidentTypeId = incidentTypeId;
    }
}
