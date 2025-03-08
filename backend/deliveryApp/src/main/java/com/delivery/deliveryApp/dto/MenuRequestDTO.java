package com.delivery.deliveryApp.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MenuRequestDTO {
    @NotNull
    private String name;

    @NotNull
    private Long restaurantId; // The restaurant to which this menu belongs
}
