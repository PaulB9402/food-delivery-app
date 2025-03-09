package com.delivery.deliveryApp.dto;

import com.delivery.deliveryApp.model.OrderItem;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderItemDTO {
    private Long foodItemId;
    private int quantity;

    public OrderItemDTO(OrderItem orderItem) {
        this.foodItemId = orderItem.getFoodItem().getId();
        this.quantity = orderItem.getQuantity();
    }
}