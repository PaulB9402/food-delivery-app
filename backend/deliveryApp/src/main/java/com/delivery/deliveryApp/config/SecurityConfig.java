package com.delivery.deliveryApp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {}) // Use the CorsFilter bean instead
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Don't create sessions
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/users/register", "/users/login").permitAll()
                        .requestMatchers("/food-delivery-app/frontend/**").permitAll() // Allow access to static resources
                        .requestMatchers("/orders", "/orders/**").permitAll()
                        .requestMatchers("/restaurants","/restaurants/**").permitAll()
                        .requestMatchers("/food-items","/food-items/**").permitAll()
                        .requestMatchers("/menu", "/menu/**").permitAll()
                        .requestMatchers("/admin", "/admin/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/orders").permitAll() 
                        .requestMatchers(HttpMethod.POST,"/carts", "/carts/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/carts/**").permitAll() // Ensure GET requests to /carts/** are authenticated
                        .requestMatchers(HttpMethod.POST, "/orders/place").permitAll()
                        .requestMatchers(HttpMethod.GET, "/users").permitAll()
                        .requestMatchers(HttpMethod.GET, "/users/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/restaurants").permitAll()
                        .requestMatchers(HttpMethod.GET, "/restaurants/**").permitAll()
                        .anyRequest().authenticated()
                )
                .formLogin(form -> form
                        .disable()
                )
                .logout(logout -> logout
                        .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
                        .permitAll());

        return http.build();
    }

    // CORS configuration should be working now:
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true); // Allow cookies to be sent
        config.addAllowedOrigin("http://localhost:3000"); // Ajoutez cette ligne
        config.addAllowedOrigin("http://127.0.0.1:3000"); 
        config.addAllowedOrigin("http://localhost:5500"); // Si vous utilisez Live Server
        config.addAllowedOrigin("http://127.0.0.1:5500");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*"); // Autoriser toutes les méthodes HTTP
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}