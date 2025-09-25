package com.bookstore.backend.dto;

import lombok.Data;
import jakarta.validation.constraints.NotNull;

@Data
public class CartAddRequestDto {
    @NotNull
    private Long bookId;

    @NotNull
    private Integer quantity;
}