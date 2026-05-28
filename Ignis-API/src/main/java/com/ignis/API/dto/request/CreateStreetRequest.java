package com.ignis.API.dto.request;

public class CreateStreetRequest {

    private String name;
    private Long cityId;

    public CreateStreetRequest() {
    }

    public String getName() {
        return name;
    }

    public Long getCityId() {
        return cityId;
    }
}
