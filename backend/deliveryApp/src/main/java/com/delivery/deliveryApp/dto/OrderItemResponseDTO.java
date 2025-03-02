package com.delivery.deliveryApp.dto;

import lombok.Data;

@Data
public class OrderItemResponseDTO {
    private Long id;
    private Long foodItemId;
    private int quantity;
    private String customization;
}