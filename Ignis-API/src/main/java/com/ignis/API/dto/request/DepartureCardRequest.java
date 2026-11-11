package com.ignis.API.dto.request;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public class DepartureCardRequest {

    @NotNull(message = "Numer wyjazdu jest wymagany")
    private Integer departureNumber;

    @NotBlank(message = "Data wyjazdu jest wymagana")
    private String date;

    @NotBlank(message = "Godzina wyjazdu jest wymagana")
    private String timeDeparture;

    @NotBlank(message = "Godzina powrotu jest wymagana")
    private String timeArrival;

    @NotNull(message = "Miejscowość jest wymagana")
    private Long cityId;

    // Ulica jest opcjonalna — serwis obsługuje null
    private Long streetId;

    @NotNull(message = "Liczba kilometrów jest wymagana")
    @PositiveOrZero(message = "Liczba kilometrów nie może być ujemna")
    private Integer distance;

    @NotNull(message = "Powód wyjazdu jest wymagany")
    private Long incidentId;

    // @Valid sprawia, że walidowany jest też każdy element listy (VehicleCrewRequest)
    @NotEmpty(message = "Wymagany jest co najmniej jeden pojazd z obsadą")
    @Valid
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
