package com.ignis.API.dto;

import java.util.List;

public class FirefighterResponse {

    private Integer id;
    private String login;
    private String name;
    private String lastname;
    private String email;
    private String status;
    private String fireStation;
    private List<String> roles;

    public FirefighterResponse(Integer id, String login, String name, String lastname, String email, String status, String fireStation, List<String> roles) {
        this.id = id;
        this.login = login;
        this.name = name;
        this.lastname = lastname;
        this.email = email;
        this.status = status;
        this.fireStation = fireStation;
        this.roles = roles;
    }

    public Integer getId() {
        return id;
    }

    public String getLogin() {
        return login;
    }

    public String getName() {
        return name;
    }

    public String getLastname() {
        return lastname;
    }

    public String getEmail() {
        return email;
    }

    public String getStatus() {
        return status;
    }

    public String getFireStation() {
        return fireStation;
    }

    public List<String> getRoles() {
        return roles;
    }

}
