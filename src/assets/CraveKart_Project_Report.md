
# CraveKart Food Delivery Platform
## Project Report

![CraveKart Logo](https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop)

## Table of Contents
1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [Technical Architecture](#technical-architecture)
4. [User Roles & Permissions](#user-roles--permissions)
5. [Data Management](#data-management)
6. [User Interface Design](#user-interface-design)
7. [Key Components](#key-components)
8. [Authentication & Authorization](#authentication--authorization)
9. [Future Enhancements](#future-enhancements)

## Project Overview

CraveKart is a comprehensive food delivery platform that connects customers with restaurants and food shops. The application allows users to browse restaurants, view menus, place orders, and track deliveries. Restaurant owners can register their shops, manage menus, and fulfill orders through the platform.

This application has been designed as a client-side only application that utilizes local storage for data persistence, allowing it to function entirely in the browser without server dependencies.

## Key Features

### For Customers
- **Shop Discovery**: Browse and search for restaurants by name, cuisine, or category
- **Menu Browsing**: View complete menus with detailed food descriptions and prices
- **Cart Management**: Add items to cart, modify quantities, and review orders before checkout
- **Order Tracking**: Track order status from placement to delivery
- **User Profiles**: Manage personal information, addresses, and payment methods
- **Order History**: View past orders and easily reorder favorites

### For Shop Owners
- **Shop Registration**: Register new restaurants with details like name, description, and cuisine categories
- **Menu Management**: Add, edit, and remove menu items with prices and descriptions
- **Order Management**: Receive and process incoming orders
- **Shop Analytics**: View basic sales data and customer preferences
- **Promotional Tools**: Offer discounts and special promotions

## Technical Architecture

CraveKart is built using modern web technologies:

- **Frontend Framework**: React with TypeScript
- **Routing**: React Router for navigation between pages
- **State Management**: React Context API for global state management
- **UI Component Library**: Shadcn UI with Tailwind CSS for styling
- **Animation**: Framer Motion for smooth page transitions and UI interactions
- **Form Handling**: React Hook Form with Zod validation
- **Data Storage**: LocalStorage for client-side data persistence
- **Notifications**: Toast notifications for user feedback

### Application Structure

```
src/
├── components/      # Reusable UI components
├── contexts/        # React context providers
├── hooks/           # Custom React hooks
├── lib/             # Utility functions and constants
├── pages/           # Application pages/routes
├── services/        # Data services for CRUD operations
└── assets/          # Static assets like images
```

## User Roles & Permissions

The application supports three primary user roles:

1. **Customers**
   - Browse shops and menus
   - Place and track orders
   - Manage personal information

2. **Shop Owners**
   - Register and manage shops
   - Manage menu items
   - Process incoming orders

3. **Guests** (Unauthenticated Users)
   - Browse shops and menus
   - View basic information
   - Cannot place orders or access restricted features

## Data Management

CraveKart uses localStorage for data persistence, enabling full functionality without backend dependencies:

### Key Data Entities

1. **Users**
   - Personal information
   - Authentication details
   - Order history
   - Payment methods

2. **Shops**
   - Shop details (name, description, logo)
   - Category information
   - Owner information

3. **Food Items**
   - Item details (name, description, price)
   - Category associations
   - Shop affiliations

4. **Orders**
   - Order items and quantities
   - Delivery information
   - Payment details
   - Order status

### Data Flow

1. User actions trigger state updates in React components
2. Context providers manage global state changes
3. Service functions handle data operations (CRUD)
4. Data is persisted to localStorage
5. UI updates reflect the current state

## User Interface Design

CraveKart features a responsive, user-friendly interface designed for various screen sizes:

### Design Principles

- **Clean and Minimalist**: Focus on content with clear visual hierarchy
- **Responsive Design**: Adapts to various screen sizes from mobile to desktop
- **Consistent Styling**: Unified color scheme and component design
- **Intuitive Navigation**: Clear pathways for user journeys
- **Visual Feedback**: Animations and transitions for user actions

### Key UI Components

- **Shop Cards**: Visually appealing displays of restaurant information
- **Food Item Cards**: Clear presentation of menu items with images and prices
- **Cart Interface**: Intuitive item management and checkout process
- **Form Elements**: User-friendly input fields with validation feedback
- **Navigation**: Responsive header with mobile-friendly menu

## Key Components

### Core Pages

1. **Home Page**
   - Featured shops
   - Quick category access
   - Call-to-action elements

2. **Shops Page**
   - Shop listing with filtering options
   - Search functionality
   - Category-based browsing

3. **Shop Details Page**
   - Shop information
   - Menu browsing
   - Category filtering

4. **Cart Page**
   - Item management
   - Quantity adjustments
   - Order summary

5. **Checkout Page**
   - Delivery information
   - Payment method selection
   - Order confirmation

6. **User Profile Page**
   - Personal information management
   - Order history
   - Address book

7. **Shop Registration Page**
   - Shop information entry
   - Category selection
   - Logo upload

8. **Shop Dashboard Page**
   - Order management
   - Menu editing
   - Basic analytics

### Key Functional Components

1. **Authentication Components**
   - Login forms
   - Registration forms
   - Password recovery

2. **Shop Registration Forms**
   - Multi-step registration process
   - Category selection
   - Input validation

3. **Cart Management**
   - Add/remove items
   - Quantity adjustments
   - Shop restriction enforcement

4. **Order Processing**
   - Order creation
   - Status tracking
   - Order history

## Authentication & Authorization

The application implements a client-side authentication system:

1. **User Registration**
   - Email/password registration
   - Basic profile creation
   - User role assignment

2. **Authentication**
   - Login/logout functionality
   - Session persistence with localStorage
   - Protected routes

3. **Authorization**
   - Role-based access control
   - Feature restrictions based on user type
   - Context-based UI adjustments

## Future Enhancements

Potential improvements for future versions:

1. **Server Integration**
   - Backend API for data persistence
   - Real-time order updates
   - User authentication with JWT

2. **Advanced Features**
   - Real-time order tracking
   - In-app messaging between customers and shops
   - Review and rating system
   - Loyalty programs

3. **Performance Optimizations**
   - Server-side rendering for initial page load
   - Image optimization and lazy loading
   - Code splitting for faster page loads

4. **Additional Integrations**
   - Payment gateway integration
   - Maps for delivery tracking
   - Social media authentication
   - Push notifications

---

*This document outlines the current state of the CraveKart food delivery platform as of [Current Date]. The application continues to evolve with new features and improvements.*
