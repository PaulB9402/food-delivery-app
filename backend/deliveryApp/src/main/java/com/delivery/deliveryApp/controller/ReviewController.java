package com.delivery.deliveryApp.controller;

import com.delivery.deliveryApp.dto.ReviewRequestDTO;
import com.delivery.deliveryApp.dto.ReviewResponseDTO;
import com.delivery.deliveryApp.model.Delivery;
import com.delivery.deliveryApp.model.Restaurant;
import com.delivery.deliveryApp.model.Review;
import com.delivery.deliveryApp.model.User;
import com.delivery.deliveryApp.repository.DeliveryRepository;
import com.delivery.deliveryApp.repository.RestaurantRepository;
import com.delivery.deliveryApp.repository.ReviewRepository;
import com.delivery.deliveryApp.repository.UserRepository;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/reviews")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private DeliveryRepository deliveryRepository;

    @Autowired
    private ModelMapper modelMapper;

    @PostMapping
    public ResponseEntity<?> createReview(@Valid @RequestBody ReviewRequestDTO reviewRequestDTO, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(bindingResult.getAllErrors());
        }

        Review review = modelMapper.map(reviewRequestDTO, Review.class);

        Optional<User> optionalCustomer = userRepository.findById(reviewRequestDTO.getCustomerId());
        if (optionalCustomer.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Customer not found");
        }
        User customer = optionalCustomer.get();
        review.setCustomer(customer);

        if (reviewRequestDTO.getRestaurantId() != null) {
            Optional<Restaurant> optionalRestaurant = restaurantRepository.findById(reviewRequestDTO.getRestaurantId());
            if (optionalRestaurant.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Restaurant not found");
            }
            Restaurant restaurant = optionalRestaurant.get();
            review.setRestaurant(restaurant);
        }

        if (reviewRequestDTO.getDeliveryId() != null) {
            Optional<Delivery> optionalDelivery = deliveryRepository.findById(reviewRequestDTO.getDeliveryId());
            if (optionalDelivery.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Delivery not found");
            }
            Delivery delivery = optionalDelivery.get();
            review.setDelivery(delivery);
        }

        Review savedReview = reviewRepository.save(review);
        ReviewResponseDTO reviewResponseDTO = modelMapper.map(savedReview, ReviewResponseDTO.class);
        return ResponseEntity.status(HttpStatus.CREATED).body(reviewResponseDTO);
    }

    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<?> getReviewsByRestaurant(@PathVariable Long restaurantId) {
        Optional<Restaurant> optionalRestaurant = restaurantRepository.findById(restaurantId);
        if (optionalRestaurant.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Restaurant not found");
        }
        Restaurant restaurant = optionalRestaurant.get();

        List<Review> reviews = reviewRepository.findByRestaurantId(restaurantId);
        List<ReviewResponseDTO> reviewResponseDTOs = reviews.stream()
                .map(review -> modelMapper.map(review, ReviewResponseDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(reviewResponseDTOs);
    }

    @GetMapping("/delivery/{deliveryId}")
    public ResponseEntity<?> getReviewsByDelivery(@PathVariable Long deliveryId) {
        Optional<Delivery> optionalDelivery = deliveryRepository.findById(deliveryId);
        if (optionalDelivery.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Delivery not found");
        }
        Delivery delivery = optionalDelivery.get();

        List<Review> reviews = reviewRepository.findByDeliveryId(deliveryId);
        List<ReviewResponseDTO> reviewResponseDTOs = reviews.stream()
                .map(review -> modelMapper.map(review, ReviewResponseDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(reviewResponseDTOs);
    }
}