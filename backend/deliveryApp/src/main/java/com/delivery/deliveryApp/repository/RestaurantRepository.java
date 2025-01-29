package com.delivery.deliveryApp.repository;

import com.delivery.deliveryApp.model.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    List<Restaurant> findByUserId(Long userId);
}
