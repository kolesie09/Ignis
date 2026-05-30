package com.ignis.API.dto.response;

public class CrewMemberResponse {

    private Long firefighterId;
    private String fullName;
    private String functionName;

    public CrewMemberResponse(Long firefighterId, String fullName, String functionName) {
        this.firefighterId = firefighterId;
        this.fullName = fullName;
        this.functionName = functionName;
    }

    public Long getFirefighterId() {
        return firefighterId;
    }

    public String getFullName() {
        return fullName;
    }

    public String getFunctionName() {
        return functionName;
    }

}
