package com.bookstore.backend.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class BookDto {
    private Long id;
    private String title;
    private String author;
    private String isbn;
    private String description;
    private String genre;
    private Integer stock;
    private String image;
    private BigDecimal price;
    private BigDecimal originalPrice;
}
