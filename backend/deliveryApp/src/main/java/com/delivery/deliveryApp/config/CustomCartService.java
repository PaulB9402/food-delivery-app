package com.delivery.deliveryApp.config;

import com.delivery.deliveryApp.model.Cart;
import com.delivery.deliveryApp.model.CartItem;
import com.delivery.deliveryApp.model.FoodItem;
import com.delivery.deliveryApp.model.Order;
import com.delivery.deliveryApp.model.OrderItem;
import com.delivery.deliveryApp.model.User;
import com.delivery.deliveryApp.dto.OrderItemRequestDTO;
import com.delivery.deliveryApp.repository.CartRepository;
import com.delivery.deliveryApp.repository.FoodItemRepository;
import com.delivery.deliveryApp.repository.OrderRepository;
import com.delivery.deliveryApp.repository.UserRepository;
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
        Cart cart = cartRepository.findByUserId(userId).orElseGet(() -> {
            Cart newCart = new Cart();
            User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
            newCart.setUser(user);
            cartRepository.save(newCart);
            return newCart;
        });
        // Initialiser la collection items avant de fermer la session
        cart.getItems().size();
        return cart;
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
    public Order placeOrder(Long customerId, Long restaurantId, List<OrderItemRequestDTO> orderItems) {
        User user = userRepository.findById(customerId).orElseThrow(() -> new RuntimeException("User not found"));
        Cart cart = getCartByUserId(customerId);
        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        Order order = new Order();
        order.setCustomer(user);

        List<OrderItem> orderItemList = new ArrayList<>();
        for (OrderItemRequestDTO itemDTO : orderItems) {
            FoodItem foodItem = foodItemRepository.findById(itemDTO.getFoodItemId()).orElseThrow(() -> new RuntimeException("Food item not found"));
            OrderItem orderItem = new OrderItem();
            orderItem.setFoodItem(foodItem);
            orderItem.setQuantity(itemDTO.getQuantity());
            orderItem.setOrder(order);
            orderItemList.add(orderItem);
        }
        order.setOrderItems(orderItemList);
        order.setTotalPrice(orderItemList.stream().mapToDouble(item -> item.getFoodItem().getPrice() * item.getQuantity()).sum());
        order.setStatus("PENDING");

        // Clear the cart after placing the order
        cart.getItems().clear();
        cartRepository.save(cart);

        return orderRepository.save(order);
    }

    public void clearCart(Long userId) {
        Optional<Cart> optionalCart = cartRepository.findByUserId(userId);
        if (optionalCart.isPresent()) {
            Cart cart = optionalCart.get();
            cart.getItems().clear(); // 🔄 Vider les items du panier
            cartRepository.save(cart); // 🔄 Enregistrer les modifications
        }
    }
}