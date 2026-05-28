package com.ignis.API.dto.response;

import java.time.LocalDate;
import java.time.LocalTime;

public class DepartureCardHistoryResponse {

    private Long id;
    private Integer departureNumber;
    private LocalDate departureDate;
    private LocalTime hourDeparture;
    private LocalTime hourReturn;

    private String placeName;
    private String incidentName;
    private String commanderName;
    private String typeCardName;

    public DepartureCardHistoryResponse() {
    }

    public DepartureCardHistoryResponse(
            Long id,
            Integer departureNumber,
            LocalDate departureDate,
            LocalTime hourDeparture,
            LocalTime hourReturn,
            String placeName,
            String incidentName,
            String commanderName,
            String typeCardName
    ) {
        this.id = id;
        this.departureNumber = departureNumber;
        this.departureDate = departureDate;
        this.hourDeparture = hourDeparture;
        this.hourReturn = hourReturn;
        this.placeName = placeName;
        this.incidentName = incidentName;
        this.commanderName = commanderName;
        this.typeCardName = typeCardName;
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

    public String getPlaceName() {
        return placeName;
    }

    public String getIncidentName() {
        return incidentName;
    }

    public String getCommanderName() {
        return commanderName;
    }

    public String getTypeCardName() {
        return typeCardName;
    }
}
