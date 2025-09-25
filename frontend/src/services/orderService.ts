import apiClient from './apiClient';
import { OrderDto, UpdateOrderStatusRequest } from '../types/api';

/**
 * Order Service
 * Handles all order-related API calls
 */
export const orderService = {
  /**
   * Create a new order from the user's cart (checkout)
   * @returns Promise with the created order
   */
  checkout: async (): Promise<OrderDto> => {
    const response = await apiClient.post<OrderDto>('/api/orders/checkout');
    return response.data;
  },

  /**
   * Get orders for the current authenticated user
   * @returns Promise with list of user orders
   */
  getUserOrders: async (): Promise<OrderDto[]> => {
    const response = await apiClient.get<OrderDto[]>('/api/orders/me');
    return response.data;
  },

  /**
   * Get all orders (admin only)
   * @returns Promise with list of all orders
   */
  getAllOrders: async (): Promise<OrderDto[]> => {
    const response = await apiClient.get<OrderDto[]>('/api/orders');
    return response.data;
  },

  /**
   * Update an order's status (admin only)
   * @param orderId The order ID to update
   * @param status New status value
   * @returns Promise with the updated order
   */
  updateOrderStatus: async (orderId: number, status: string): Promise<OrderDto> => {
    const request: UpdateOrderStatusRequest = { status };
    const response = await apiClient.put<OrderDto>(`/api/orders/${orderId}/status`, request);
    return response.data;
  }
};

export default orderService;
