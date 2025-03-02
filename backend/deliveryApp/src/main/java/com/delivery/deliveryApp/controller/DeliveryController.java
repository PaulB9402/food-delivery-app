package com.delivery.deliveryApp.controller;

import com.delivery.deliveryApp.dto.DeliveryRequestDTO;
import com.delivery.deliveryApp.dto.DeliveryResponseDTO;
import com.delivery.deliveryApp.model.Delivery;
import com.delivery.deliveryApp.model.Order;
import com.delivery.deliveryApp.model.User;
import com.delivery.deliveryApp.repository.DeliveryRepository;
import com.delivery.deliveryApp.repository.OrderRepository;
import com.delivery.deliveryApp.repository.UserRepository;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/deliveries")
public class DeliveryController {

    @Autowired
    private DeliveryRepository deliveryRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;

    @PostMapping
    public ResponseEntity<?> createDelivery(@Valid @RequestBody DeliveryRequestDTO deliveryRequestDTO, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(bindingResult.getAllErrors());
        }

        Delivery delivery = modelMapper.map(deliveryRequestDTO, Delivery.class);

        Optional<Order> optionalOrder = orderRepository.findById(deliveryRequestDTO.getOrderId());
        if (optionalOrder.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found");
        }
        Order order = optionalOrder.get();

        Optional<User> optionalDeliveryPerson = userRepository.findById(deliveryRequestDTO.getDeliveryPersonId());
        if (optionalDeliveryPerson.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Delivery Person not found");
        }
        User deliveryPerson = optionalDeliveryPerson.get();

        delivery.setOrder(order);
        delivery.setDeliveryPerson(deliveryPerson);

        Delivery savedDelivery = deliveryRepository.save(delivery);
        DeliveryResponseDTO deliveryResponseDTO = modelMapper.map(savedDelivery, DeliveryResponseDTO.class);
        return ResponseEntity.status(HttpStatus.CREATED).body(deliveryResponseDTO);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDelivery(@PathVariable Long id) {
        Optional<Delivery> optionalDelivery = deliveryRepository.findById(id);
        if (optionalDelivery.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Delivery not found");
        }
        Delivery delivery = optionalDelivery.get();
        DeliveryResponseDTO deliveryResponseDTO = modelMapper.map(delivery, DeliveryResponseDTO.class);
        return ResponseEntity.ok(deliveryResponseDTO);
    }
}