package com.ignis.API.dto;

public class CityResponse {

    private Integer id;
    private String name;

    public CityResponse(Integer id, String name) {
        this.id = id;
        this.name = name;
    }

    public Integer getId() {
        return id;
    }

    public String getName() {
        return name;
    }
}
