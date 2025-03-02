// FoodItemRequestDTO.java
package com.delivery.deliveryApp.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class FoodItemRequestDTO {
    @NotBlank(message = "Name cannot be blank")
    private String name;

    @NotBlank(message = "Description cannot be blank")
    private String description;

    @NotNull(message = "Price cannot be null")
    @Min(value = 0, message = "Price must be a non-negative value")
    private double price;

    @NotBlank(message = "Photos cannot be blank")
    private String photos; // Store image URLs or file paths

    @NotNull(message = "Restaurant ID cannot be null")
    private Long restaurantId;
}