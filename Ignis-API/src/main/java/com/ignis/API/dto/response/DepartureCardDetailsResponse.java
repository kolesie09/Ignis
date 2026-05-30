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

    private String cityName;
    private String streetName;
    private String incidentName;
    private String typeCardName;
    private String commanderName;
    private String createdByName;

    private List<VehicleCrewResponse> vehicles;

    public DepartureCardDetailsResponse(
            Long id,
            Integer departureNumber,
            LocalDate departureDate,
            LocalTime hourDeparture,
            LocalTime hourReturn,
            String cityName,
            String streetName,
            String incidentName,
            String typeCardName,
            String commanderName,
            String createdByName,
            List<VehicleCrewResponse> vehicles
    ) {
        this.id = id;
        this.departureNumber = departureNumber;
        this.departureDate = departureDate;
        this.hourDeparture = hourDeparture;
        this.hourReturn = hourReturn;
        this.cityName = cityName;
        this.streetName = streetName;
        this.incidentName = incidentName;
        this.typeCardName = typeCardName;
        this.commanderName = commanderName;
        this.createdByName = createdByName;
        this.vehicles = vehicles;
    }

    public Long getId() {
        return id;
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

}
