package com.bookstore.backend.service;

import com.bookstore.backend.dto.CartDto;
import com.bookstore.backend.dto.CartItemDto;
import com.bookstore.backend.exception.BookNotFoundException;
import com.bookstore.backend.exception.CartItemNotFoundException;
import com.bookstore.backend.model.Book;
import com.bookstore.backend.model.CartItem;
import com.bookstore.backend.model.User;
import com.bookstore.backend.repository.BookRepository;
import com.bookstore.backend.repository.CartItemRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class CartService {
    private static final Logger logger = LoggerFactory.getLogger(CartService.class);

    private final CartItemRepository cartItemRepository;
    private final BookRepository bookRepository;
    private final ModelMapper modelMapper;

    public CartService(CartItemRepository cartItemRepository, BookRepository bookRepository, ModelMapper modelMapper) {
        this.cartItemRepository = cartItemRepository;
        this.bookRepository = bookRepository;
        this.modelMapper = modelMapper;
    }

    public CartDto getCartItems(User user) {
        List<CartItem> items = cartItemRepository.findByUser(user);
        List<CartItemDto> itemDtos = items.stream().map(cartItem -> {
            CartItemDto dto = modelMapper.map(cartItem, CartItemDto.class);
            dto.setBookId(cartItem.getBook().getId());
            dto.setTitle(cartItem.getBook().getTitle());
            dto.setPrice(cartItem.getBook().getPrice());
            dto.setImage(cartItem.getBook().getImage());
            return dto;
        }).toList();

        BigDecimal total = itemDtos.stream()
                .map(item -> item.getPrice().multiply(new BigDecimal(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new CartDto(itemDtos, total);
    }

    public List<CartItem> getCartItemsForOrder(User user) {
        return cartItemRepository.findByUser(user);
    }

    public CartItemDto addCartItem(User user, Long bookId, Integer quantity) {
        logger.info("Attempting to add bookId: {} with quantity: {} for user: {}", bookId, quantity, user.getUsername());
        try {
            Book book = bookRepository.findById(bookId)
                    .orElseThrow(() -> new BookNotFoundException("Book not found with ID: " + bookId));
            logger.info("Found book: {} - {}", book.getId(), book.getTitle());

            CartItem cartItem = cartItemRepository.findByUserAndBook(user, book)
                    .orElse(new CartItem());
            logger.info("Found or created cart item. Current quantity: {}", cartItem.getQuantity());

            // If it's an existing item, increment quantity, otherwise set the new quantity
            if (cartItem.getId() != null) {
                cartItem.setQuantity(cartItem.getQuantity() + quantity);
                logger.info("Incrementing quantity for existing item. New quantity: {}", cartItem.getQuantity());
            } else {
                cartItem.setUser(user);
                cartItem.setBook(book);
                cartItem.setQuantity(quantity);
                logger.info("Setting quantity for new item. Quantity: {}", cartItem.getQuantity());
            }

            cartItem = cartItemRepository.save(cartItem);
            logger.info("Cart item saved successfully. CartItemId: {}", cartItem.getId());
            return modelMapper.map(cartItem, CartItemDto.class);
        } catch (BookNotFoundException e) {
            logger.error("Book not found: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("An unexpected error occurred while adding to cart: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to add item to cart due to an internal error.", e);
        }
    }

    public void updateCartItemQuantity(User user, Long cartItemId, Integer quantity) {
        logger.info("Attempting to update cartItemId: {} with quantity: {} for user: {}", cartItemId, quantity, user.getUsername());
        try {
            CartItem cartItem = cartItemRepository.findById(cartItemId)
                    .orElseThrow(() -> new CartItemNotFoundException("Cart item not found with ID: " + cartItemId));
            if (!cartItem.getUser().getId().equals(user.getId())) {
                logger.warn("Unauthorized attempt to update cart item: {} by user: {}", cartItemId, user.getUsername());
                throw new RuntimeException("Unauthorized access to cart item");
            }
            cartItem.setQuantity(quantity);
            cartItemRepository.save(cartItem);
            logger.info("Cart item {} updated successfully. New quantity: {}", cartItemId, quantity);
        } catch (CartItemNotFoundException e) {
            logger.error("Cart item not found: {}", e.getMessage());
            throw e;
        } catch (RuntimeException e) {
            if (e.getMessage().contains("Unauthorized")) {
                throw e;
            }
            logger.error("An unexpected error occurred while updating cart item: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to update cart item due to an internal error.", e);
        } catch (Exception e) {
            logger.error("An unexpected error occurred while updating cart item: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to update cart item due to an internal error.", e);
        }
    }

    public void removeCartItem(User user, Long cartItemId) {
        logger.info("Attempting to remove cartItemId: {} for user: {}", cartItemId, user.getUsername());
        try {
            CartItem cartItem = cartItemRepository.findById(cartItemId)
                    .orElseThrow(() -> new CartItemNotFoundException("Cart item not found with ID: " + cartItemId));
            if (!cartItem.getUser().getId().equals(user.getId())) {
                logger.warn("Unauthorized attempt to remove cart item: {} by user: {}", cartItemId, user.getUsername());
                throw new RuntimeException("Unauthorized access to cart item");
            }
            cartItemRepository.delete(cartItem);
            logger.info("Cart item {} removed successfully.", cartItemId);
        } catch (CartItemNotFoundException e) {
            logger.error("Cart item not found: {}", e.getMessage());
            throw e;
        } catch (RuntimeException e) {
            if (e.getMessage().contains("Unauthorized")) {
                throw e;
            }
            logger.error("An unexpected error occurred while removing cart item: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to remove cart item due to an internal error.", e);
        } catch (Exception e) {
            logger.error("An unexpected error occurred while removing cart item: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to remove cart item due to an internal error.", e);
        }
    }

    @Transactional
    public void clearCart(User user) {
        logger.info("Attempting to clear cart for user: {}", user.getUsername());
        try {
            cartItemRepository.deleteByUser(user);
            logger.info("Cart cleared successfully for user: {}", user.getUsername());
        } catch (Exception e) {
            logger.error("An unexpected error occurred while clearing cart: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to clear cart due to an internal error.", e);
        }
    }
}