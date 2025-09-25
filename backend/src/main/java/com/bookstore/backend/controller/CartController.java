package com.bookstore.backend.controller;

import com.bookstore.backend.dto.CartAddRequestDto;
import com.bookstore.backend.dto.CartDto;
import com.bookstore.backend.dto.CartItemDto;
import com.bookstore.backend.model.User;
import com.bookstore.backend.repository.UserRepository;
import com.bookstore.backend.service.CartService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    private static final Logger logger = LoggerFactory.getLogger(CartController.class);
    @Autowired
    private CartService cartService;
    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser(UserDetails userDetails) {
        return userRepository.findByUsername(userDetails.getUsername()).orElseThrow();
    }

    @GetMapping
    public CartDto getCart(@AuthenticationPrincipal UserDetails userDetails) {
        User user = getCurrentUser(userDetails);
        return cartService.getCartItems(user);
    }

    @PostMapping("/add")
    public CartItemDto addToCart(@AuthenticationPrincipal UserDetails userDetails,
                                 @RequestBody CartAddRequestDto cartAddRequestDto) {
        logger.info("--- CartController: addToCart called with bookId: {} and quantity: {}",
                cartAddRequestDto.getBookId(), cartAddRequestDto.getQuantity());
        User user = getCurrentUser(userDetails);
        return cartService.addCartItem(user, cartAddRequestDto.getBookId(), cartAddRequestDto.getQuantity());
    }

    @PutMapping("/update/{cartItemId}")
    public void updateCartItem(@AuthenticationPrincipal UserDetails userDetails,
                               @PathVariable Long cartItemId,
                               @RequestParam Integer quantity) {
        User user = getCurrentUser(userDetails);
        cartService.updateCartItemQuantity(user, cartItemId, quantity);
    }

    @DeleteMapping("/remove/{cartItemId}")
    public void removeCartItem(@AuthenticationPrincipal UserDetails userDetails,
                               @PathVariable Long cartItemId) {
        User user = getCurrentUser(userDetails);
        cartService.removeCartItem(user, cartItemId);
    }
}