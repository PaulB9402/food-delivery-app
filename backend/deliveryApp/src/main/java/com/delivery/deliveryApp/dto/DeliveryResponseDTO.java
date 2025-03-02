// DeliveryResponseDTO.java
package com.delivery.deliveryApp.dto;

import lombok.Data;

@Data
public class DeliveryResponseDTO {
    private Long id;
    private Long orderId;
    private Long deliveryPersonId;
    private String status;
}