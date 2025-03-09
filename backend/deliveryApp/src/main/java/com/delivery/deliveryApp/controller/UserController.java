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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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

// Récupérer un utilisateur par ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        logger.info("Demande de récupération pour l'utilisateur avec ID: {}", id);
        
        Optional<User> userOptional = userRepository.findById(id);
        if (!userOptional.isPresent()) {
            logger.warn("Utilisateur avec ID {} non trouvé", id);
            return ResponseEntity.notFound().build();
        }

        User user = userOptional.get();
        // Pour des raisons de sécurité, on ne renvoie pas le mot de passe
        user.setPassword(null);
        
        logger.info("Utilisateur avec ID {} récupéré avec succès", id);
        return ResponseEntity.ok(user);
    }

    // Récupérer tous les utilisateurs
    @GetMapping
    public ResponseEntity<?> getAllUsers() {
        logger.info("Demande de récupération de tous les utilisateurs");
        
        List<User> users = userRepository.findAll();
        // Pour des raisons de sécurité, on ne renvoie pas les mots de passe
        users.forEach(user -> user.setPassword(null));
        
        logger.info("{} utilisateurs récupérés avec succès", users.size());
        return ResponseEntity.ok(users);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user) {
        logger.info("Login attempt for user: {}", user.getUsername());

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword())
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);

            UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
            List<String> roles = userDetails.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList());

            // ✅ Récupération de l'utilisateur dans la base de données
            Optional<User> optionalUser = userRepository.findByUsername(user.getUsername());
            if (optionalUser.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Utilisateur introuvable"));
            }

            User loggedInUser = optionalUser.get();
            String token = jwtTokenProvider.generateToken(user.getUsername(), roles);

            // ✅ Ajout de `userId` dans la réponse
            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "userId", loggedInUser.getId()
            ));
        } catch (Exception e) {
            logger.error("Login failed for user: {}", user.getUsername(), e);
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