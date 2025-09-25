# Bookstore Frontend (Vite + React + TypeScript)

A modern, responsive React frontend for the Spring Boot bookstore backend. Built with Vite, TypeScript, Tailwind CSS, React Router, React Query, Zustand, Axios, Framer Motion, and Lucide icons.

## Prerequisites
- Node.js 18+
- The Spring Boot backend running locally (default: http://localhost:8080)

## Configuration
Create a `.env` file in `frontend/` and set the backend URL:

```
VITE_API_BASE_URL=http://localhost:8080
```

See `.env.example` for reference.

## Install & Run (Windows cmd)

```bat
cd C:\Users\Sanket\BookStore\frontend
npm install
npm run dev
```

The dev server opens at http://localhost:5173.

## Build & Preview

```bat
cd C:\Users\Sanket\BookStore\frontend
npm run build
npm run preview
```

Preview server runs at http://localhost:4173.

## Project Structure
- `src/pages` – Route pages (Home, Category, Book Detail, Cart, Orders, Admin Dashboard)
- `src/components` – UI components (Navbar, Footer, ProtectedRoute, Loader, Alerts, BookCard, Pagination)
- `src/services/api.ts` – Centralized Axios client and typed API helpers
- `src/store/auth.ts` – Auth state (Zustand + localStorage)
- `src/utils/format.ts` – Helpers for currency, dates, and image URLs
- `tailwind.config.js` – Tailwind setup; `src/styles/index.css` includes Tailwind layers

## Auth & Security
- JWT is stored in localStorage and attached via Axios interceptor
- Protected routes redirect unauthenticated users to `/login`
- Role-based gate in `ProtectedRoute` for Admin-only screens

## Mapped Features
- Public: Register, Login, Browse books (pagination), Categories, Book details, File fetch
- User: Cart (add, update, remove), Checkout, View my orders
- Admin: Manage users, list all orders, manage books (CRUD) + upload book image

## Notes
- Ensure backend CORS allows requests from the frontend dev origin (http://localhost:5173)
- Image paths served by backend `/api/files/{filename}` are resolved with `VITE_API_BASE_URL`

## Troubleshooting
- If the API base URL differs, update `.env` and restart the dev server
- If you see 401 errors, make sure to login; admin pages require an ADMIN role token
- After code changes, if types/paths aren’t recognized, retry `npm run build` to verify


