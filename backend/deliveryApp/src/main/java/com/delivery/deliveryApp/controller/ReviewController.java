package com.delivery.deliveryApp.controller;

import com.delivery.deliveryApp.model.Review;
import com.delivery.deliveryApp.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reviews")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @PostMapping
    public Review createReview(@RequestBody Review review) {
        return reviewRepository.save(review);
    }

    @GetMapping("/restaurant/{restaurantId}")
    public List<Review> getReviewsByRestaurant(@PathVariable Long restaurantId) {
        return reviewRepository.findByRestaurantId(restaurantId);
    }

    @GetMapping("/delivery/{deliveryId}")
    public List<Review> getReviewsByDelivery(@PathVariable Long deliveryId) {
        return reviewRepository.findByDeliveryId(deliveryId);
    }
}