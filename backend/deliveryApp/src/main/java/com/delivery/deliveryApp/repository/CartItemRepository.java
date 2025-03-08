package com.delivery.deliveryApp.repository;

import com.delivery.deliveryApp.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {}