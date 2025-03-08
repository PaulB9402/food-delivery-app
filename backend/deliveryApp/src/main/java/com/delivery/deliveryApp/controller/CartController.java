package com.delivery.deliveryApp.controller;

import com.delivery.deliveryApp.model.Cart;
import com.delivery.deliveryApp.config.CustomCartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/carts")
public class CartController {

    @Autowired
    private CustomCartService cartService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<Cart> getCartByUserId(@PathVariable Long userId) {
        Cart cart = cartService.getCartByUserId(userId);
        return ResponseEntity.ok(cart);
    }

    @PostMapping("/user/{userId}/add-item/{foodItemId}")
    public ResponseEntity<Cart> addItemToCart(@PathVariable Long userId, @PathVariable Long foodItemId, @RequestParam int quantity) {
        Cart cart = cartService.addItemToCart(userId, foodItemId, quantity);
        return ResponseEntity.ok(cart);
    }
}