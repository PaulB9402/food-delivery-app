package com.delivery.deliveryApp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan({"com.delivery.deliveryApp", "com.your.config.package"}) // Adjust "com.your.config.package"
public class DeliveryAppApplication {

    public static void main(String[] args) {
        SpringApplication.run(DeliveryAppApplication.class, args);
    }
}