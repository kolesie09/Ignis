package com.ignis.API.security;

import org.springframework.stereotype.Service;

import org.springframework.beans.factory.annotation.Value;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;
    @Value("${jwt.expiration}")
    private long expiration;

}
