package com.delivery.deliveryApp.config;

import com.delivery.deliveryApp.model.*;
import com.delivery.deliveryApp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CustomCartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private FoodItemRepository foodItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    public Cart getCartByUserId(Long userId) {
        return cartRepository.findByUserId(userId).orElseGet(() -> {
            Cart cart = new Cart();
            User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
            cart.setUser(user);
            cartRepository.save(cart);
            return cart;
        });
    }

    @Transactional
    public Cart addItemToCart(Long userId, Long foodItemId, int quantity) {
        Cart cart = getCartByUserId(userId);
        Optional<FoodItem> foodItemOptional = foodItemRepository.findById(foodItemId);
        if (foodItemOptional.isEmpty()) {
            throw new RuntimeException("Food item not found");
        }
        FoodItem foodItem = foodItemOptional.get();

        CartItem cartItem = new CartItem();
        cartItem.setFoodItem(foodItem);
        cartItem.setQuantity(quantity);
        cartItem.setCart(cart); // Set the cart for the cart item
        cart.getItems().add(cartItem);

        // Initialiser la collection items avant de fermer la session
        cart.getItems().size();
        return cartRepository.save(cart);
    }

    @Transactional
    public Order placeOrder(Long userId) {
        Cart cart = getCartByUserId(userId);
        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        Order order = new Order();
        order.setCustomer(cart.getUser());
        order.setRestaurant(cart.getItems().get(0).getFoodItem().getRestaurant());
        order.setStatus("PENDING");

        double totalPrice = 0;
        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem cartItem : cart.getItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setFoodItem(cartItem.getFoodItem());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setOrder(order);
            orderItems.add(orderItem);
            totalPrice += cartItem.getFoodItem().getPrice() * cartItem.getQuantity();
        }
        order.setOrderItems(orderItems);
        order.setTotalPrice(totalPrice);

        cart.getItems().clear();
        cartRepository.save(cart);

        return orderRepository.save(order);
    }
}