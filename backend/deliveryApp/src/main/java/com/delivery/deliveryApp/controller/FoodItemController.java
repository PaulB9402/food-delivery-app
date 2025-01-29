package com.delivery.deliveryApp.controller;

import com.delivery.deliveryApp.model.FoodItem;
import com.delivery.deliveryApp.repository.FoodItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/food-items")
public class FoodItemController {

    @Autowired
    private FoodItemRepository foodItemRepository;

    @PostMapping
    public FoodItem createFoodItem(@RequestBody FoodItem foodItem) {
        return foodItemRepository.save(foodItem);
    }

    @GetMapping("/{id}")
    public FoodItem getFoodItem(@PathVariable Long id) {
        return foodItemRepository.findById(id).orElseThrow(() -> new RuntimeException("FoodItem not found"));
    }
}
