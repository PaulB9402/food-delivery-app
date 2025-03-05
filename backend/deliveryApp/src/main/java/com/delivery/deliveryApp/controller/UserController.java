package com.delivery.deliveryApp.controller;

import com.delivery.deliveryApp.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import com.delivery.deliveryApp.model.User;
import java.util.Optional;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.delivery.deliveryApp.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;



@RestController
@RequestMapping("/users")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;


    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user) {
    logger.info("Login attempt for user: {}", user.getUsername());

    try {
        logger.info("User entered password: {}", user.getPassword());
        logger.info("Stored hashed password: {}", userDetailsService.loadUserByUsername(user.getUsername()).getPassword());
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        String token = jwtTokenProvider.generateToken(user.getUsername(), roles);
        logger.info("Login successful for user: {}", user.getUsername());
        return ResponseEntity.ok(Map.of("token", token));
    } catch (Exception e) {
        logger.error("Login failed for user: {}", user.getUsername(), e);
        // Return a JSON response with an error message
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Invalid credentials"));
    }
}


    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        // Vérifier si l'utilisateur existe déjà
        Optional<User> existingUser = userRepository.findByUsername(user.getUsername());
        if (existingUser.isPresent()) {
            return ResponseEntity.badRequest().body("Username is already taken.");
        }

        // Hacher le mot de passe
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Enregistrer l'utilisateur
        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully.");
    }
}