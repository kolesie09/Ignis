package com.ignis.API.dto.response;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public class DepartureCardDetailsResponse {

    private Long id;
    private Integer departureNumber;
    private LocalDate departureDate;
    private LocalTime hourDeparture;
    private LocalTime hourReturn;

    private Long cityId;
    private String cityName;
    private Long streetId;
    private String streetName;
    private Long incidentTypeId;
    private String incidentTypeName;
    private Long incidentId;
    private String incidentName;
    private String typeCardName;
    private String commanderName;
    private String createdByName;
    private Integer trip;

    private List<VehicleCrewResponse> vehicles;

    public DepartureCardDetailsResponse(
            Long id,
            Integer departureNumber,
            LocalDate departureDate,
            LocalTime hourDeparture,
            LocalTime hourReturn,
            Long cityId,
            String cityName,
            Long streetId,
            String streetName,
            Long incidentTypeId,
            String incidentTypeName,
            Long incidentId,
            String incidentName,
            String typeCardName,
            String commanderName,
            String createdByName,
            List<VehicleCrewResponse> vehicles,
            Integer trip
    ) {
        this.id = id;
        this.departureNumber = departureNumber;
        this.departureDate = departureDate;
        this.hourDeparture = hourDeparture;
        this.hourReturn = hourReturn;
        this.cityId = cityId;
        this.cityName = cityName;
        this.streetId = streetId;
        this.streetName = streetName;
        this.incidentTypeId = incidentTypeId;
        this.incidentTypeName = incidentTypeName;
        this.incidentId = incidentId;
        this.incidentName = incidentName;
        this.typeCardName = typeCardName;
        this.commanderName = commanderName;
        this.createdByName = createdByName;
        this.vehicles = vehicles;
        this.trip = trip;
    }

    public Long getId() {
        return id;
    }

    public Long getCityId() {
        return cityId;
    }

    public Long getStreetId() {
        return streetId;
    }

    public Long getIncidentTypeId() {
        return incidentTypeId;
    }

    public Long getIncidentId() {
        return incidentId;
    }

    public String getIncidentTypeName() {
        return incidentTypeName;
    }

    public Integer getDepartureNumber() {
        return departureNumber;
    }

    public LocalDate getDepartureDate() {
        return departureDate;
    }

    public LocalTime getHourDeparture() {
        return hourDeparture;
    }

    public LocalTime getHourReturn() {
        return hourReturn;
    }

    public String getCityName() {
        return cityName;
    }

    public String getStreetName() {
        return streetName;
    }

    public String getIncidentName() {
        return incidentName;
    }

    public String getTypeCardName() {
        return typeCardName;
    }

    public String getCommanderName() {
        return commanderName;
    }

    public String getCreatedByName() {
        return createdByName;
    }

    public List<VehicleCrewResponse> getVehicles() {
        return vehicles;
    }

    public Integer getTrip() {
        return trip;
    }

}
