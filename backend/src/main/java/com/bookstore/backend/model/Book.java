package com.bookstore.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "books")
@Getter @Setter
@NoArgsConstructor
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String title;

    @NotBlank
    private String author;

    @NotBlank
    @Column(unique = true)
    private String isbn;

    @Column(columnDefinition = "TEXT") // Allow for long descriptions
    private String description;

    @NotNull
    private BigDecimal price;

    private BigDecimal originalPrice;

    @NotNull
    @Column(name = "stock_quantity")
    private Integer stock = 0;

    private String image;

    private String genre;
}