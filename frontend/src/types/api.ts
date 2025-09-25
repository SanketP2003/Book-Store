/**
 * API Type Definitions
 * This file contains all TypeScript interfaces for the API data objects
 * matching the Spring Boot backend DTOs
 */

// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserRegistrationRequest {
  username: string;
  email: string;
  password: string;
}

export interface UserDto {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: UserDto;
}

// Book Types
export interface BookDto {
  id?: number;
  title: string;
  author: string;
  isbn: string;
  description: string;
  genre: string;
  stock: number;
  image?: string;
  price: number | string;
  originalPrice?: number | string;
}

export interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

// Cart Types
export interface CartAddRequest {
  bookId: number;
  quantity: number;
}

export interface CartItemDto {
  id: number;
  bookId: number;
  title: string;
  quantity: number;
  price: string | number;
  image?: string;
}

export interface CartDto {
  items: CartItemDto[];
  total: string | number;
}

// Order Types
export interface OrderItemDto {
  id: number;
  quantity: number;
  price: string | number;
  book: BookDto;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export interface OrderDto {
  id: number;
  orderDate: string;
  status: OrderStatus | string;
  totalAmount: string | number;
  userId: number;
  orderItems: OrderItemDto[];
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus | string;
}

// Error Handling
export interface ApiError {
  status: number;
  message: string;
  timestamp?: string;
  path?: string;
  details?: string[];
}
