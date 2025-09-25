package com.bookstore.backend.dto;

import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class LoginRequestDto {
    @NotBlank @Email
    private String email;

    @NotBlank
    private String password;

    // getters and setters
}