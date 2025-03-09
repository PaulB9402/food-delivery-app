package com.delivery.deliveryApp.controller;

import com.delivery.deliveryApp.model.Order;
import com.delivery.deliveryApp.config.CustomCartService;
import com.delivery.deliveryApp.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.delivery.deliveryApp.model.User;
import org.springframework.security.core.annotation.AuthenticationPrincipal;


import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CustomCartService cartService;

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<Order> createOrder(@AuthenticationPrincipal User user, @RequestBody Order order) {
    if (user == null) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
    order.setCustomer(user); // Associer l'utilisateur connecté à la commande
    return ResponseEntity.ok(orderRepository.save(order));
}

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
    public ResponseEntity<Order> placeOrder(@RequestParam Long userId) {
        Order order = cartService.placeOrder(userId);
        return ResponseEntity.ok(order);
    }

    @PostMapping("/pay")
    public ResponseEntity<String> payOrder(@RequestParam Long orderId, @RequestParam String paymentDetails) {
        // Intégration du paiement (exemple simplifié)
        // Vous pouvez utiliser des services de paiement comme Stripe, PayPal, etc.
        // Ici, nous supposons que le paiement est toujours réussi.
        return ResponseEntity.ok("Payment successful for order ID: " + orderId);
    }
}