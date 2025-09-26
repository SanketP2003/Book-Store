// Import and define BookDto directly instead of re-exporting
export interface BookDto {
  id: number;
  title: string;
  author: string;
  isbn: string;
  description: string;
  genre: string;
  stock: number;
  image: string;
  price: string;
  originalPrice: string;
}

// Generic response wrapper for paginated data
export interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  empty: boolean;
}

// Auth related types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserRegistrationRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: UserDto;
}

// API Error type
export interface ApiError {
  status: number;
  message: string;
  timestamp?: string;
  path?: string;
  details?: any[];
}

// Order related types
export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus | string;
}

export interface OrderItem {
  id: number;
  bookId: number;
  title: string;
  author: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface Order {
  id: number;
  userId: number;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
  updatedAt?: string;
}

// OrderDto type for API responses
export interface OrderDto extends Order {
  items: OrderItem[];
}

// Cart related types
export interface CartAddRequest {
  bookId: number;
  quantity: number;
}

export interface CartItem {
  id: number;
  bookId: number;
  title: string;
  author: string;
  quantity: number;
  price: number;
  image?: string;
}

export type CartItemDto = CartItem;

export interface CartDto {
  id: number;
  userId: number;
  items: CartItem[];
  total: number;
}

// User related types
export interface UserDto {
  id: number;
  username: string;
  email: string;
  password?: string; // Adding this to fix UserManagement error
  role: string;
  createdAt: string;
  updatedAt?: string;
}
