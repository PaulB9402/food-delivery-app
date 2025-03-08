package com.delivery.deliveryApp.repository;

import com.delivery.deliveryApp.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByRestaurantId(Long restaurantId);
    List<Review> findByDeliveryId(Long deliveryId);
    List<Review> findByFoodItemId(Long foodItemId);
}