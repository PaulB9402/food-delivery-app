package com.delivery.deliveryApp.controller;

import com.delivery.deliveryApp.dto.DeliveryResponseDTO;
import com.delivery.deliveryApp.model.Delivery;
import com.delivery.deliveryApp.config.CustomDeliveryService;
import com.delivery.deliveryApp.repository.DeliveryRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/deliveries")
public class DeliveryController {

    @Autowired
    private CustomDeliveryService deliveryService;

    @Autowired
    private DeliveryRepository deliveryRepository;

    @Autowired
    private ModelMapper modelMapper;

    @PostMapping("/assign")
    public ResponseEntity<?> assignDelivery(@RequestParam Long orderId, @RequestParam Long deliveryPersonId) {
        Delivery delivery = deliveryService.assignDelivery(orderId, deliveryPersonId);
        DeliveryResponseDTO deliveryResponseDTO = modelMapper.map(delivery, DeliveryResponseDTO.class);
        return ResponseEntity.status(HttpStatus.CREATED).body(deliveryResponseDTO);
    }

    @PostMapping("/update-status")
    public ResponseEntity<?> updateDeliveryStatus(@RequestParam Long deliveryId, @RequestParam String status) {
        Delivery delivery = deliveryService.updateDeliveryStatus(deliveryId, status);
        DeliveryResponseDTO deliveryResponseDTO = modelMapper.map(delivery, DeliveryResponseDTO.class);
        return ResponseEntity.ok(deliveryResponseDTO);
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