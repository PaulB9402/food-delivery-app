package com.delivery.deliveryApp.controller;

import com.delivery.deliveryApp.model.Cart;
import com.delivery.deliveryApp.config.CustomCartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/carts")
public class CartController {

    @Autowired
    private CustomCartService cartService;

    @PostMapping("/user/{userId}/clear")
    public ResponseEntity<Void> clearCart(@PathVariable Long userId) {
        cartService.clearCart(userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user/{userId}")
    @Transactional(readOnly = true)
    public ResponseEntity<Cart> getCartByUserId(@PathVariable Long userId) {
        Cart cart = cartService.getCartByUserId(userId);
        // Initialiser la collection items avant de fermer la session
        cart.getItems().size();
        return ResponseEntity.ok(cart);
    }

    @PostMapping("/user/{userId}/add-item/{itemId}")
    @Transactional
    public ResponseEntity<?> addItemToCart(@PathVariable Long userId, @PathVariable Long itemId, @RequestParam int quantity) {
        try {
            Cart cart = cartService.addItemToCart(userId, itemId, quantity);
            // Initialiser la collection items avant de fermer la session
            cart.getItems().size();
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur lors de l'ajout de l'article au panier.");
        }
    }
    
}