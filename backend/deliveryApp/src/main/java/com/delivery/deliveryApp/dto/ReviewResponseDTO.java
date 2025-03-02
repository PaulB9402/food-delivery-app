package com.delivery.deliveryApp.dto;

import lombok.Data;

@Data
public class ReviewResponseDTO {
    private Long id;
    private Long customerId;
    private Long restaurantId;
    private Long deliveryId;
    private int rating;
    private String comment;
}