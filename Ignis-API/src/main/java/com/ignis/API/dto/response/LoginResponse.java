package com.ignis.API.dto.response;

import java.util.List;

public class LoginResponse {

    private final String token;
    private final List<String> roles;

    public LoginResponse(String token, List<String> roles) {
        this.token = token;
        this.roles = roles;
    }

    public String getToken() {
        return token;
    }

    public List<String> getRoles() {
        return roles;
    }
}
