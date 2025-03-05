package com.delivery.deliveryApp.controller;

import com.delivery.deliveryApp.dto.RestaurantRequestDTO;
import com.delivery.deliveryApp.dto.RestaurantResponseDTO;
import com.delivery.deliveryApp.model.Restaurant;
import com.delivery.deliveryApp.model.User;
import com.delivery.deliveryApp.repository.RestaurantRepository;
import com.delivery.deliveryApp.repository.UserRepository;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/restaurants")
public class RestaurantController {
    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;

    @PostMapping
public ResponseEntity<?> createRestaurant(@Valid @RequestBody RestaurantRequestDTO restaurantRequestDTO, BindingResult bindingResult) {
    if (bindingResult.hasErrors()) {
        return ResponseEntity.badRequest().body(bindingResult.getAllErrors()); // Return validation errors
    }

    Restaurant restaurant = modelMapper.map(restaurantRequestDTO, Restaurant.class);

    // Use the user ID from the request DTO
    Long userId = restaurantRequestDTO.getUserId();
    Optional<User> optionalUser = userRepository.findById(userId);
    if (optionalUser.isEmpty()) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
    }

    User user = optionalUser.get();
    restaurant.setUser(user);

    Restaurant savedRestaurant = restaurantRepository.save(restaurant);
    RestaurantResponseDTO restaurantResponseDTO = modelMapper.map(savedRestaurant, RestaurantResponseDTO.class);
    return ResponseEntity.status(HttpStatus.CREATED).body(restaurantResponseDTO);
}

    @GetMapping("/{id}")
    public ResponseEntity<?> getRestaurant(@PathVariable Long id) {
        Optional<Restaurant> optionalRestaurant = restaurantRepository.findById(id);
        if (optionalRestaurant.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Restaurant not found");
        }
        Restaurant restaurant = optionalRestaurant.get();
        RestaurantResponseDTO restaurantResponseDTO = modelMapper.map(restaurant, RestaurantResponseDTO.class);
        return ResponseEntity.ok(restaurantResponseDTO);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getRestaurantsByUserId(@PathVariable Long userId) {
        List<Restaurant> restaurants = restaurantRepository.findByUserId(userId);
        List<RestaurantResponseDTO> restaurantResponseDTOs = restaurants.stream()
                .map(restaurant -> modelMapper.map(restaurant, RestaurantResponseDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(restaurantResponseDTOs);
    }
}
