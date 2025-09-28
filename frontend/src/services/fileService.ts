import apiClient from './apiClient';

/**
 * File Service
 * Handles all file-related API calls
 */
export const fileService = {
  /**
   * Upload a file to the server
   * @param file The file to upload
   * @returns Promise with filename/path of uploaded file
   */
  uploadFile: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<string>('/api/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  /**
   * Get the full URL for a file by its filename
   * @param filename The filename/path
   * @returns Complete URL to access the file
   */
  getFileUrl: (filename: string): string => {
    const baseUrl = import.meta.env.VITE_API_URL || 'https://book-store-backend-8880.onrender.com';
    return `${baseUrl}/api/files/${filename}`;
  }
};

export default fileService;
