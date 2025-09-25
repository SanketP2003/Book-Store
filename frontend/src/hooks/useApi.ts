import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService, bookService, cartService, orderService, userService } from '../services';
import { BookDto, CartAddRequest, LoginRequest, OrderStatus, UserRegistrationRequest } from '../types/api';

/**
 * Custom React Query hooks for API operations
 * These hooks make it easy to use our API services with React Query's
 * caching, loading states, and error handling
 */

// Auth hooks
export function useLogin() {
  return useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: () => {
      // You could redirect the user or show a success message
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (userData: UserRegistrationRequest) => authService.register(userData),
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      // Clear all queries from the cache when user logs out
      queryClient.clear();
    },
  });
}

// Books hooks
export function useBooks(page = 0, size = 10) {
  return useQuery({
    queryKey: ['books', { page, size }],
    queryFn: () => bookService.getAllBooks(page, size),
  });
}

export function useBooksByCategory(category: string, page = 0, size = 10) {
  return useQuery({
    queryKey: ['books', 'category', category, { page, size }],
    queryFn: () => bookService.getBooksByCategory(category, page, size),
    enabled: !!category,
  });
}

export function useBook(id: number | string | undefined) {
  return useQuery({
    queryKey: ['book', id],
    queryFn: () => bookService.getBookById(Number(id)),
    enabled: !!id,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => bookService.getAllCategories(),
  });
}

export function useCreateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookData: BookDto) => bookService.createBook(bookData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
}

export function useUpdateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, bookData }: { id: number; bookData: BookDto }) =>
      bookService.updateBook(id, bookData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['book', data.id] });
    },
  });
}

export function useDeleteBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => bookService.deleteBook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
}

export function useUploadBookImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) =>
      bookService.uploadBookImage(id, file),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['book', data.id] });
    },
  });
}

// Cart hooks
export function useCart() {
  return useQuery({
    queryKey: ['cart'],
    queryFn: () => cartService.getCart(),
    // Don't fetch cart if user is not authenticated
    enabled: !!localStorage.getItem('auth_token'),
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cartAddRequest: CartAddRequest) => cartService.addToCart(cartAddRequest),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cartItemId, quantity }: { cartItemId: number; quantity: number }) =>
      cartService.updateCartItem(cartItemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cartItemId: number) => cartService.removeCartItem(cartItemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

// Order hooks
export function useCheckout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: orderService.checkout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useUserOrders() {
  return useQuery({
    queryKey: ['orders', 'user'],
    queryFn: () => orderService.getUserOrders(),
    enabled: !!localStorage.getItem('auth_token'),
  });
}

export function useAllOrders() {
  return useQuery({
    queryKey: ['orders', 'all'],
    queryFn: () => orderService.getAllOrders(),
    enabled: !!localStorage.getItem('auth_token'),
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: number; status: OrderStatus | string }) =>
      orderService.updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

// User hooks (admin)
export function useAllUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getAllUsers(),
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userData }: { id: number; userData: any }) =>
      userService.updateUser(id, userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
