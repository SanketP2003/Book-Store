package com.bookstore.backend.security;

import com.bookstore.backend.service.CustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        logger.info("--- JWT Filter: Processing request for URI: {}", request.getRequestURI());
        String header = request.getHeader("Authorization");
        String token = null;
        String username = null;

        if (header != null && header.startsWith("Bearer ")) {
            token = header.substring(7);
            logger.info("--- JWT Filter: Token extracted. Attempting to get username from token.");
            try {
                username = jwtUtil.getUsernameFromToken(token);
                logger.info("--- JWT Filter: Username extracted from token: {}", username);
            } catch (Exception e) {
                logger.error("--- JWT Filter: Error extracting username from token: {}", e.getMessage(), e);
            }
        } else {
            logger.warn("--- JWT Filter: Authorization header missing or does not start with Bearer.");
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            logger.info("--- JWT Filter: Username is present and no existing authentication. Loading user details.");
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            logger.info("--- JWT Filter: UserDetails loaded for username: {}. Validating token.", userDetails.getUsername());

            if (jwtUtil.validateToken(token)) {
                logger.info("--- JWT Filter: Token is valid. Setting authentication in SecurityContext.");
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
                logger.info("--- JWT Filter: Authentication set for user: {}", userDetails.getUsername());
            } else {
                logger.warn("--- JWT Filter: Token validation failed for username: {}", username);
            }
        } else if (username != null && SecurityContextHolder.getContext().getAuthentication() != null) {
            logger.info("--- JWT Filter: Username is present but authentication already exists for user: {}", SecurityContextHolder.getContext().getAuthentication().getName());
        }

        filterChain.doFilter(request, response);
        logger.info("--- JWT Filter: Finished processing request for URI: {}", request.getRequestURI());
    }
}