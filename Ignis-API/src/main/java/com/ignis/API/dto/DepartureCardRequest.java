package com.ignis.API.dto;

import java.util.List;

public class DepartureCardRequest {

    private Integer departureNumber;
    private String date;
    private String timeDeparture;
    private String timeArrival;
    private Integer cityId;
    private Integer streetId;
    private Integer distance;
    private Integer incidentId;
    private List<VehicleCrewRequest> crews;

    public Integer getDepartureNumber() {
        return departureNumber;
    }

    public String getDate() {
        return date;
    }

    public String getTimeDeparture() {
        return timeDeparture;
    }

    public String getTimeArrival() {
        return timeArrival;
    }

    public Integer getCityId() {
        return cityId;
    }

    public Integer getStreetId() {
        return streetId;
    }

    public Integer getDistance() {
        return distance;
    }

    public Integer getIncidentId() {
        return incidentId;
    }

    public List<VehicleCrewRequest> getCrews() {
        return crews;
    }

    public void setDepartureNumber(Integer departureNumber) {
        this.departureNumber = departureNumber;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public void setTimeDeparture(String timeDeparture) {
        this.timeDeparture = timeDeparture;
    }

    public void setTimeArrival(String timeArrival) {
        this.timeArrival = timeArrival;
    }

    public void setCityId(Integer cityId) {
        this.cityId = cityId;
    }

    public void setStreetId(Integer streetId) {
        this.streetId = streetId;
    }

    public void setDistance(Integer distance) {
        this.distance = distance;
    }

    public void setIncidentId(Integer incidentId) {
        this.incidentId = incidentId;
    }

    public void setCrews(List<VehicleCrewRequest> crews) {
        this.crews = crews;
    }
}
