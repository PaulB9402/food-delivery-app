package com.delivery.deliveryApp.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class OrderRequestDTO {

    @NotNull(message = "Customer ID cannot be null")
    private Long customerId;

    @NotNull(message = "Restaurant ID cannot be null")
    private Long restaurantId;

    @NotNull(message = "Order Items cannot be null")
    private List<OrderItemRequestDTO> orderItems;
}