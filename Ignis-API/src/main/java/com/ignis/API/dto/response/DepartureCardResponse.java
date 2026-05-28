package com.ignis.API.dto.response;

public class DepartureCardResponse {

    private Long id;
    private Integer departureNumber;
    private String message;

    public DepartureCardResponse(Long id, Integer departureNumber, String message) {
        this.id = id;
        this.departureNumber = departureNumber;
        this.message = message;
    }

    public Long getId() {
        return id;
    }

    public Integer getDepartureNumber() {
        return departureNumber;
    }

    public String getMessage() {
        return message;
    }
}
