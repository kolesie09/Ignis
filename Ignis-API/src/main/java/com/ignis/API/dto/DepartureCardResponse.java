package com.ignis.API.dto;

public class DepartureCardResponse {

    private Integer id;
    private Integer departureNumber;
    private String message;

    public DepartureCardResponse(Integer id, Integer departureNumber, String message) {
        this.id = id;
        this.departureNumber = departureNumber;
        this.message = message;
    }

    public Integer getId() {
        return id;
    }

    public Integer getDepartureNumber() {
        return departureNumber;
    }

    public String getMessage() {
        return message;
    }
}
