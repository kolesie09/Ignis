package com.ignis.API.dto;

public class CreateStreetRequest {

    private String name;
    private Integer cityId;

    public CreateStreetRequest() {
    }

    public String getName() {
        return name;
    }

    public Integer getCityId() {
        return cityId;
    }
}
