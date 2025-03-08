package com.delivery.deliveryApp.controller;

import com.delivery.deliveryApp.model.Delivery;
import com.delivery.deliveryApp.config.CustomDeliveryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class DeliveryStatusController {

    @Autowired
    private CustomDeliveryService deliveryService;

    @MessageMapping("/update-status")
    @SendTo("/topic/delivery-status")
    public Delivery updateDeliveryStatus(Long deliveryId, String status) {
        return deliveryService.updateDeliveryStatus(deliveryId, status);
    }
}
