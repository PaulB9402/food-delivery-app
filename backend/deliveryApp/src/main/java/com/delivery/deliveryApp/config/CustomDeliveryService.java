package com.delivery.deliveryApp.config;

import com.delivery.deliveryApp.model.Delivery;
import com.delivery.deliveryApp.model.Order;
import com.delivery.deliveryApp.model.User;
import com.delivery.deliveryApp.repository.DeliveryRepository;
import com.delivery.deliveryApp.repository.OrderRepository;
import com.delivery.deliveryApp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomDeliveryService {

    @Autowired
    private DeliveryRepository deliveryRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    public Delivery assignDelivery(Long orderId, Long deliveryPersonId) {
        Optional<Order> optionalOrder = orderRepository.findById(orderId);
        if (optionalOrder.isEmpty()) {
            throw new RuntimeException("Order not found");
        }
        Order order = optionalOrder.get();

        Optional<User> optionalDeliveryPerson = userRepository.findById(deliveryPersonId);
        if (optionalDeliveryPerson.isEmpty()) {
            throw new RuntimeException("Delivery person not found");
        }
        User deliveryPerson = optionalDeliveryPerson.get();

        Delivery delivery = new Delivery();
        delivery.setOrder(order);
        delivery.setDeliveryPerson(deliveryPerson);
        delivery.setStatus("PENDING");

        return deliveryRepository.save(delivery);
    }

    public Delivery updateDeliveryStatus(Long deliveryId, String status) {
        Optional<Delivery> optionalDelivery = deliveryRepository.findById(deliveryId);
        if (optionalDelivery.isEmpty()) {
            throw new RuntimeException("Delivery not found");
        }
        Delivery delivery = optionalDelivery.get();
        delivery.setStatus(status);

        return deliveryRepository.save(delivery);
    }
}