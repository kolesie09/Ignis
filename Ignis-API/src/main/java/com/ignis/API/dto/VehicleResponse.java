package com.ignis.API.dto;

public class VehicleResponse {

    private Integer id;
    private String title;
    private Integer firefightersCount;

    public VehicleResponse(Integer id, String title, Integer firefightersCount) {
        this.id = id;
        this.title = title;
        this.firefightersCount = firefightersCount;
    }

    public Integer getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public Integer getFirefightersCount() {
        return firefightersCount;
    }
}
