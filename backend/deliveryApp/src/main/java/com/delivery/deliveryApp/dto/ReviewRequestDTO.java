package com.delivery.deliveryApp.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReviewRequestDTO {
    @NotNull(message = "Customer ID cannot be null")
    private Long customerId;

    private Long restaurantId;  // Can be null if reviewing a delivery or food item
    private Long deliveryId; // Can be null if reviewing a restaurant or food item
    private Long foodItemId; // Can be null if reviewing a restaurant or delivery

    @NotNull(message = "Rating cannot be null")
    @Min(value = 1, message = "Rating must be between 1 and 5")
    @Max(value = 5, message = "Rating must be between 1 and 5")
    private int rating;

    private String comment;
}