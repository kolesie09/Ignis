package com.ignis.API.dto.response;

public class VehicleResponse {

    private Long id;
    private String title;
    private Integer firefightersCount;

    public VehicleResponse(Long id, String title, Integer firefightersCount) {
        this.id = id;
        this.title = title;
        this.firefightersCount = firefightersCount;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public Integer getFirefightersCount() {
        return firefightersCount;
    }
}
