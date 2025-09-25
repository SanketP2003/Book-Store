import apiClient from './apiClient';
import { CartAddRequest, CartDto, CartItemDto } from '../types/api';

/**
 * Cart Service
 * Handles all cart-related API calls
 */
export const cartService = {
  /**
   * Get the current user's cart
   * @returns Promise with cart information including items and total
   */
  getCart: async (): Promise<CartDto> => {
    const response = await apiClient.get<CartDto>('/api/cart');
    return response.data;
  },

  /**
   * Add an item to the user's cart
   * @param cartAddRequest Book ID and quantity to add
   * @returns Promise with the added cart item
   */
  addToCart: async (cartAddRequest: CartAddRequest): Promise<CartItemDto> => {
    const response = await apiClient.post<CartItemDto>('/api/cart/add', cartAddRequest);
    return response.data;
  },

  /**
   * Update the quantity of a cart item
   * @param cartItemId The cart item ID to update
   * @param quantity New quantity
   * @returns Promise that resolves when update is complete
   */
  updateCartItem: async (cartItemId: number, quantity: number): Promise<void> => {
    await apiClient.put(`/api/cart/update/${cartItemId}`, null, {
      params: { quantity }
    });
  },

  /**
   * Remove an item from the cart
   * @param cartItemId The cart item ID to remove
   * @returns Promise that resolves when item is removed
   */
  removeCartItem: async (cartItemId: number): Promise<void> => {
    await apiClient.delete(`/api/cart/remove/${cartItemId}`);
  }
};

export default cartService;
