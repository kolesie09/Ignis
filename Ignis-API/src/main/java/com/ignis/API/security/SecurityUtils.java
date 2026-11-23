package com.ignis.API.security;

import org.springframework.security.core.Authentication;

public class SecurityUtils {

    private SecurityUtils() {

    }

    public static boolean isSuperAdmin(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_SUPER_ADMIN"));
    }

}
