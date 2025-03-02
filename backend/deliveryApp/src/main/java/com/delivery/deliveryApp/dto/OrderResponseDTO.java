package com.delivery.deliveryApp.dto;

import lombok.Data;

import java.util.List;

@Data
public class OrderResponseDTO {
    private Long id;
    private Long customerId;
    private Long restaurantId;
    private String status;
    private double totalPrice;
    private List<OrderItemResponseDTO> orderItems;
}
