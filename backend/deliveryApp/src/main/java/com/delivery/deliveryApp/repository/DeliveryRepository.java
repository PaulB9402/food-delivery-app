package com.delivery.deliveryApp.repository;

import com.delivery.deliveryApp.model.Delivery;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeliveryRepository extends JpaRepository<Delivery, Long> {
}