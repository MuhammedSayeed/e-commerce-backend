# 🛒 Backend API for E-Commerce Platform – Overview

This project is a robust and scalable **Node.js + Express** backend API for an e-commerce platform, built with clean architecture principles and modular design.

## ✅ Core Features

- **Product Management:**
  - Add, update, delete, and fetch products.
  - Handle product images and data validation.

- **Advanced API Features:**
  - **Filtering:** Search by category, price range, brand, etc.
  - **Sorting:** Sort results by price, rating, date, etc.
  - **Pagination:** Support for page and limit query parameters.
  - **Field Limiting:** Return only requested fields for optimization.
  - **Search:** Keyword-based product search using query strings.

- **Authentication & Authorization:**
  - JWT-based authentication system.
  - Role-based access control for admin and user-level permissions.
  - Private and protected routes.

- **User Features:**
  - Sign up, login, logout, profile management.
  - Secured password handling and token verification.

- **Middleware:**
  - Centralized error handling.
  - Custom reusable middleware for access control and filtering logic.

## 🔒 Security

- Input sanitization to prevent NoSQL injections.
- Rate limiting to prevent brute-force attacks.

## 🧩 Tech Stack

- **Node.js**, **Express**
- **MongoDB** (with Mongoose)
- **JWT** for authentication

