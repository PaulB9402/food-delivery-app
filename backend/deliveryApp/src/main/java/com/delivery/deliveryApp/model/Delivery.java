package com.delivery.deliveryApp.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "deliveries")
public class Delivery {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne
    @JoinColumn(name = "delivery_person_id", nullable = false)
    private User deliveryPerson;

    @Column(nullable = false)
    private String status; // e.g., PENDING, IN_PROGRESS, DELIVERED
}