package com.delivery.deliveryApp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;


@SpringBootApplication
@ComponentScan({"com.delivery.deliveryApp"}) // Adjust "com.your.config.package"
@EnableJpaRepositories("com.delivery.deliveryApp.repository")
public class DeliveryAppApplication {

    public static void main(String[] args) {
        SpringApplication.run(DeliveryAppApplication.class, args);
    }
}