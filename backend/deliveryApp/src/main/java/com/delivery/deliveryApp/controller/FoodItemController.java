package com.delivery.deliveryApp.controller;

import com.delivery.deliveryApp.dto.FoodItemRequestDTO;
import com.delivery.deliveryApp.dto.FoodItemResponseDTO;
import com.delivery.deliveryApp.model.FoodItem;
import com.delivery.deliveryApp.model.Restaurant;
import com.delivery.deliveryApp.repository.FoodItemRepository;
import com.delivery.deliveryApp.repository.RestaurantRepository;
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
@RequestMapping("/food-items")
public class FoodItemController {

    @Autowired
    private FoodItemRepository foodItemRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private ModelMapper modelMapper;

    @PostMapping
    public ResponseEntity<?> createFoodItem(@Valid @RequestBody FoodItemRequestDTO foodItemRequestDTO, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(bindingResult.getAllErrors());
        }

        FoodItem foodItem = modelMapper.map(foodItemRequestDTO, FoodItem.class);

        Optional<Restaurant> optionalRestaurant = restaurantRepository.findById(foodItemRequestDTO.getRestaurantId());
        if (optionalRestaurant.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Restaurant not found");
        }
        Restaurant restaurant = optionalRestaurant.get();

        foodItem.setRestaurant(restaurant);

        FoodItem savedFoodItem = foodItemRepository.save(foodItem);
        FoodItemResponseDTO foodItemResponseDTO = modelMapper.map(savedFoodItem, FoodItemResponseDTO.class);
        return ResponseEntity.status(HttpStatus.CREATED).body(foodItemResponseDTO);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getFoodItem(@PathVariable Long id) {
        Optional<FoodItem> optionalFoodItem = foodItemRepository.findById(id);
        if (optionalFoodItem.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("FoodItem not found");
        }
        FoodItem foodItem = optionalFoodItem.get();
        FoodItemResponseDTO foodItemResponseDTO = modelMapper.map(foodItem, FoodItemResponseDTO.class);
        return ResponseEntity.ok(foodItemResponseDTO);
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchFoodItems(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) Long restaurantId) {

        List<FoodItem> foodItems = foodItemRepository.findAll();
        List<FoodItemResponseDTO> foodItemResponseDTOs = foodItems.stream()
                .map(foodItem -> modelMapper.map(foodItem, FoodItemResponseDTO.class))
                .collect(Collectors.toList());

        return ResponseEntity.ok(foodItemResponseDTOs);
    }
}