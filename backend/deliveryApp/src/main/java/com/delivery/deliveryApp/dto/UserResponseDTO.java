// UserResponseDTO.java
package com.delivery.deliveryApp.dto;

import lombok.Data;

@Data
public class UserResponseDTO {
    private Long id;
    private String username;
    private String email;
    private String role;
}