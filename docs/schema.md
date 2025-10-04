# 📘 Database Schema Documentation

This document provides a detailed overview of each table in the **ShopTrack** e-commerce database schema.

---

## 🧑users

### Purpose
Stores registered customer information.

### Key Fields
| Field       | Type      | Description              |
|-------------|-----------|--------------------------|
| id          | Int       | Primary key              |
| email       | String    | Unique user email        |
| name        | String    | Optional display name    |
| createdAt   | DateTime  | Registration timestamp   |

### Relationships
- Has many `orders`
- Has many `reviews`

---

## products

### Purpose
Contains product listings and inventory details.

### Key Fields
| Field       | Type      | Description                |
|-------------|-----------|----------------------------|
| id          | Int       | Primary key                |
| name        | String    | Product name               |
| description | String    | Product details            |
| price       | Float     | Current price              |
| stock       | Int       | Available quantity         |
| imageUrl    | String    | Optional image reference   |
| categoryId  | Int       | Foreign key to `categories`|
| createdAt   | DateTime  | Listing creation timestamp |

### Relationships
- Belongs to `category`
- Has many `order_items`
- Has many `reviews`

---

## categories

### Purpose
Organizes products into logical groupings.

### Key Fields
| Field     | Type      | Description          |
|-----------|-----------|----------------------|
| id        | Int       | Primary key          |
| name      | String    | Category name        |
| createdAt | DateTime  | When category added  |

### Relationships
- Has many `products`

---

## orders

### urpose
Represents customer purchases and transactions.

### Key Fields
| Field     | Type      | Description                |
|-----------|-----------|----------------------------|
| id        | Int       | Primary key                |
| userId    | Int       | Foreign key to `users`     |
| total     | Float     | Total purchase amount      |
| status    | String    | e.g., pending, paid, etc.  |
| createdAt | DateTime  | Order timestamp            |

### Relationships
- Belongs to `user`
- Has many `order_items`

---

## order_items

### Purpose
Join table for `orders` and `products` to support many-to-many relationships.

### Key Fields
| Field     | Type    | Description                         |
|-----------|---------|-------------------------------------|
| id        | Int     | Primary key                         |
| orderId   | Int     | Foreign key to `orders`             |
| productId | Int     | Foreign key to `products`           |
| quantity  | Int     | How many of the product were bought |
| price     | Float   | Price per item at time of order     |

### Relationships
- Belongs to `order`
- Belongs to `product`

---

## reviews

### Purpose
Captures user feedback for products.

### Key Fields
| Field     | Type      | Description                         |
|-----------|-----------|-------------------------------------|
| id        | Int       | Primary key                         |
| userId    | Int       | Foreign key to `users`              |
| productId | Int       | Foreign key to `products`           |
| rating    | Int       | 1–5 star rating                     |
| comment   | String    | Optional written feedback           |
| createdAt | DateTime  | Timestamp of review submission      |

### Relationships
- Belongs to `user`
- Belongs to `product`

---

## Entity Relationship Summary

| Table        | Has Many          | Belongs To     |
|--------------|-------------------|----------------|
| users        | orders, reviews   | —              |
| products     | reviews, order_items | category    |
| categories   | products          | —              |
| orders       | order_items       | user           |
| order_items  | —                 | order, product |
| reviews      | —                 | user, product  |

---

## Notes

- All timestamps use `@default(now())` to auto-generate `createdAt`.
- The schema is designed to be scalable and normalized.
- `order_items` handles price history and decouples orders from product price updates.

