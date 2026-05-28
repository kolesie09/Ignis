package com.ignis.API.dto.response;

public class StreetResponse {

    private Long id;
    private String name;

    public StreetResponse(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

}
