package com.bookstore.backend.repository;

import com.bookstore.backend.model.Order;
import com.bookstore.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    @Query("SELECT o FROM Order o JOIN FETCH o.orderItems oi JOIN FETCH oi.book WHERE o.user = :user")
    List<Order> findByUserWithItems(@Param("user") User user);

    @Query("SELECT o FROM Order o JOIN FETCH o.orderItems oi JOIN FETCH oi.book")
    List<Order> findAllWithItems();
}
