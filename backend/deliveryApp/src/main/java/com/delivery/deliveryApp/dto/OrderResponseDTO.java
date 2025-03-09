package com.delivery.deliveryApp.dto;

import com.delivery.deliveryApp.model.Order;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
public class OrderResponseDTO {
    private Long id;
    private Long customerId;
    private Long restaurantId;
    private List<OrderItemDTO> orderItems;
    private double totalPrice;
    private String status;

    public OrderResponseDTO(Order order) {
        this.id = order.getId();
        this.customerId = order.getCustomer().getId();
        this.restaurantId = order.getRestaurant().getId();
        this.orderItems = order.getOrderItems().stream()
            .map(OrderItemDTO::new)
            .collect(Collectors.toList());
        this.totalPrice = order.getTotalPrice();
        this.status = order.getStatus();
    }
}