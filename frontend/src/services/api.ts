import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers = config.headers || {}
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

// Auth
export const authApi = {
  register: (data: { username: string; email: string; password: string }) => api.post('/api/auth/register', data),
  login: (data: { email: string; password: string }) => api.post('/api/auth/login', data),
  logout: () => api.post('/api/auth/logout'),
}

// Books
export type BookDto = {
  id: number
  title: string
  author: string
  isbn: string
  description: string
  genre: string
  stock: number
  image: string
  price: string
  originalPrice: string
}

export const booksApi = {
  list: (page = 0, size = 12) => api.get(`/api/books`, { params: { page, size } }),
  byCategory: (category: string, page = 0, size = 12) => api.get(`/api/books/category/${encodeURIComponent(category)}`, { params: { page, size } }),
  categories: () => api.get<string[]>(`/api/books/categories`),
  get: (id: string | number) => api.get(`/api/books/${id}`),

  // Admin
  create: (data: Partial<BookDto>) => api.post('/api/books', data),
  update: (id: number, data: Partial<BookDto>) => api.put(`/api/books/${id}`, data),
  remove: (id: number) => api.delete(`/api/books/${id}`),
  uploadImage: (id: number, file: File) => {
    const form = new FormData()
    form.append('file', file)
    return api.post(`/api/admin/books/${id}/image`, form, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
}

// Cart
export type CartItemDto = { id: number; bookId: number; title: string; quantity: number; price: string; image: string }
export type CartDto = { items: CartItemDto[]; total: string }

export const cartApi = {
  get: () => api.get<CartDto>('/api/cart'),
  add: (data: { bookId: number; quantity: number }) => api.post<CartItemDto>('/api/cart/add', data),
  update: (cartItemId: number, quantity: number) => api.put(`/api/cart/update/${cartItemId}`, null, { params: { quantity } }),
  remove: (cartItemId: number) => api.delete(`/api/cart/remove/${cartItemId}`),
}

// Orders
export type OrderItemDto = { id: number; quantity: number; price: string; book: BookDto }
export type OrderDto = { id: number; orderDate: string; status: string; totalAmount: string; userId: number; orderItems: OrderItemDto[] }

export const ordersApi = {
  checkout: () => api.post<OrderDto>('/api/orders/checkout'),
  create: (data: any) => api.post<OrderDto>('/api/orders', data),
  myOrders: () => api.get<OrderDto[]>('/api/orders/me'),
  all: () => api.get<OrderDto[]>('/api/orders'),
  updateStatus: (orderId: number, status: string) => api.put<OrderDto>(`/api/orders/${orderId}/status`, { status }),
  delete: (orderId: number) => api.delete(`/api/orders/${orderId}`),
}

// Users (Admin)
export type UserDto = { id: number; username: string; email: string; role: string }

export const adminUsersApi = {
  list: () => api.get<UserDto[]>('/api/admin/users'),
  update: (userId: number, data: Partial<UserDto>) => api.put<UserDto>(`/api/admin/users/${userId}`, data),
  remove: (userId: number) => api.delete(`/api/admin/users/${userId}`),
}

export default api
