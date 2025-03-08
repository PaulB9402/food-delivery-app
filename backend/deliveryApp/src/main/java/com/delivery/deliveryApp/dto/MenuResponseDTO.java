package com.delivery.deliveryApp.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MenuResponseDTO {
    private Long id;
    private String name;
    private Long restaurantId;
}
