import apiClient from './apiClient';
import { BookDto, PageResponse } from '../types/api';

/**
 * Book Service
 * Handles all book-related API calls
 */
export const bookService = {
  /**
   * Get a paginated list of all books
   * @param page Page number (zero-based)
   * @param size Page size
   * @returns Promise with paginated books
   */
  getAllBooks: async (page = 0, size = 10): Promise<PageResponse<BookDto>> => {
    const response = await apiClient.get<PageResponse<BookDto>>('/api/books', {
      params: { page, size }
    });
    return response.data;
  },

  /**
   * Get books by category with pagination
   * @param categoryName The category name
   * @param page Page number (zero-based)
   * @param size Page size
   * @returns Promise with paginated books in the category
   */
  getBooksByCategory: async (categoryName: string, page = 0, size = 10): Promise<PageResponse<BookDto>> => {
    const response = await apiClient.get<PageResponse<BookDto>>(`/api/books/category/${encodeURIComponent(categoryName)}`, {
      params: { page, size }
    });
    return response.data;
  },

  /**
   * Get all available book categories
   * @returns Promise with list of category names
   */
  getAllCategories: async (): Promise<string[]> => {
    const response = await apiClient.get<string[]>('/api/books/categories');
    return response.data;
  },

  /**
   * Get a single book by ID
   * @param id Book ID
   * @returns Promise with book details
   */
  getBookById: async (id: number): Promise<BookDto> => {
    const response = await apiClient.get<BookDto>(`/api/books/${id}`);
    return response.data;
  },

  /**
   * Create a new book (admin only)
   * @param bookData Book information
   * @returns Promise with created book
   */
  createBook: async (bookData: BookDto): Promise<BookDto> => {
    const response = await apiClient.post<BookDto>('/api/books', bookData);
    return response.data;
  },

  /**
   * Update an existing book (admin only)
   * @param id Book ID
   * @param bookData Updated book information
   * @returns Promise with updated book
   */
  updateBook: async (id: number, bookData: BookDto): Promise<BookDto> => {
    const response = await apiClient.put<BookDto>(`/api/books/${id}`, bookData);
    return response.data;
  },

  /**
   * Delete a book (admin only)
   * @param id Book ID
   * @returns Promise that resolves when book is deleted
   */
  deleteBook: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/books/${id}`);
  },

  /**
   * Upload a book image (admin only)
   * @param id Book ID
   * @param file Image file
   * @returns Promise with updated book including image URL
   */
  uploadBookImage: async (id: number, file: File): Promise<BookDto> => {
    // Create form data for file upload
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<BookDto>(`/api/admin/books/${id}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }
};

export default bookService;
