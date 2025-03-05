package com.delivery.deliveryApp.config;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

public class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        // Determine the target URL based on the role
        String targetUrl = determineTargetUrl(authentication);

        // Redirect to the target URL
        response.sendRedirect(targetUrl);
    }

    protected String determineTargetUrl(Authentication authentication) {
        // Get the authorities (roles) of the authenticated user
        for (GrantedAuthority authority : authentication.getAuthorities()) {
            if (authority.getAuthority().equals("CLIENT")) {
                return "http://127.0.0.1:3000/food-delivery-app/frontend/views/home.html";
            } else if (authority.getAuthority().equals("RESTAURANT")) {
                return "http://127.0.0.1:3000/food-delivery-app/frontend/views/restaurant-dashboard.html";
            } else if (authority.getAuthority().equals("ADMIN")) {
                return "http://127.0.0.1:3000/food-delivery-app/frontend/views/admin/admin.html";
            }
        }
        // Default target URL if no specific role is found
        return "http://127.0.0.1:3000/food-delivery-app/frontend/views/home.html";
    }
}
