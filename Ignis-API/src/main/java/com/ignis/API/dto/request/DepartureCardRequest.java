package com.ignis.API.dto.request;

import java.util.List;

public class DepartureCardRequest {

    private Integer departureNumber;
    private String date;
    private String timeDeparture;
    private String timeArrival;
    private Long cityId;
    private Long streetId;
    private Integer distance;
    private Long incidentId;
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

    public Long getCityId() {
        return cityId;
    }

    public Long getStreetId() {
        return streetId;
    }

    public Integer getDistance() {
        return distance;
    }

    public Long getIncidentId() {
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

    public void setCityId(Long cityId) {
        this.cityId = cityId;
    }

    public void setStreetId(Long streetId) {
        this.streetId = streetId;
    }

    public void setDistance(Integer distance) {
        this.distance = distance;
    }

    public void setIncidentId(Long incidentId) {
        this.incidentId = incidentId;
    }

    public void setCrews(List<VehicleCrewRequest> crews) {
        this.crews = crews;
    }
}
