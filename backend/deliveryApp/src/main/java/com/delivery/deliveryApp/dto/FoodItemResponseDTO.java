// FoodItemResponseDTO.java
package com.delivery.deliveryApp.dto;

import lombok.Data;

@Data
public class FoodItemResponseDTO {
    private Long id;
    private String name;
    private String description;
    private double price;
    private String photos;
    private Long restaurantId;
}