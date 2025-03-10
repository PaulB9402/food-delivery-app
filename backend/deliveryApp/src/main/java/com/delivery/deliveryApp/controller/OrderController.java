package com.delivery.deliveryApp.controller;

import com.delivery.deliveryApp.dto.OrderRequestDTO;
import com.delivery.deliveryApp.dto.OrderResponseDTO;
import com.delivery.deliveryApp.model.Order;
import com.delivery.deliveryApp.config.CustomCartService;
import com.delivery.deliveryApp.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CustomCartService cartService;

    @GetMapping("/{id}")
    public Order getOrder(@PathVariable Long id) {
        return orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
    }

    @GetMapping("/customer/{customerId}")
    public List<Order> getOrdersByCustomer(@PathVariable Long customerId) {
        return orderRepository.findByCustomerId(customerId);
    }

    @GetMapping("/restaurant/{restaurantId}")
    public List<Order> getOrdersByRestaurant(@PathVariable Long restaurantId) {
        return orderRepository.findByRestaurantId(restaurantId);
    }

    @PostMapping("/place")
    public ResponseEntity<OrderResponseDTO> placeOrder(@RequestBody OrderRequestDTO orderRequest) {
        Order order = cartService.placeOrder(
            orderRequest.getCustomerId(),
            orderRequest.getRestaurantId(),
            orderRequest.getOrderItems()
        );
        OrderResponseDTO orderResponse = new OrderResponseDTO(order);
        return ResponseEntity.ok(orderResponse);
    }

    @PostMapping("/pay")
    public ResponseEntity<String> payOrder(@RequestParam Long orderId, @RequestParam String paymentDetails) {
        // Intégration du paiement (exemple simplifié)
        // Vous pouvez utiliser des services de paiement comme Stripe, PayPal, etc.
        // Ici, nous supposons que le paiement est toujours réussi.
        return ResponseEntity.ok("Payment successful for order ID: " + orderId);
    }
}