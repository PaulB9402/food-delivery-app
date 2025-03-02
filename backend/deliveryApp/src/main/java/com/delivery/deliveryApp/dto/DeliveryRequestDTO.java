// DeliveryRequestDTO.java
package com.delivery.deliveryApp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DeliveryRequestDTO {
    @NotNull(message = "Order ID cannot be null")
    private Long orderId;

    @NotNull(message = "Delivery Person ID cannot be null")
    private Long deliveryPersonId;

    @NotBlank(message = "Status cannot be blank")
    private String status; // e.g., PENDING, IN_PROGRESS, DELIVERED
}