# Shop Aura

Shop Aura is a full-stack e-commerce application built with a React/Vite frontend and an Express/MongoDB backend. It includes product browsing, category management, customer profiles, orders, reviews, messages, addresses, and an admin dashboard structure.

## 🚀 Project Overview

- **Frontend**: React + Vite, responsive UI, routing, cart context, auth flows, admin dashboard pages.
- **Backend**: Express server with Mongoose models, MongoDB Atlas connectivity, generic REST routes, and seed utilities.
- **Data**: Products, categories, customers, orders, reviews, messages, addresses, admin details.
- **Architecture**: Separate `Frontend/` and `Backend/` folders for a clean monorepo structure.

## 🔧 Tech Stack

- Frontend:
  - React
  - Vite
  - React Router DOM
  - Axios
  - Framer Motion
  - Swiper
  - React Hot Toast
  - ESLint
- Backend:
  - Node.js
  - Express
  - MongoDB / MongoDB Atlas
  - Mongoose
  - dotenv
  - CORS
  - nodemon

## 📁 Project Structure

- `Backend/`
  - `server.js` — main Express app entrypoint
  - `config/db.js` — MongoDB connection logic
  - `models/` — Mongoose schemas and models
  - `routes/` — API route definitions
  - `middleware/` — request parsing utilities
  - `seed.js` — database seeding script
  - `.env` — environment variables for local/Atlas connection
- `Frontend/`
  - `src/` — React app source files
  - `api/api.js` — API service utilities
  - `Client/` — pages, components, routes, cart context
  - `Admin/` — admin dashboard components and pages
  - `package.json` — frontend dependencies and scripts
  - `vite.config.js` — Vite configuration

## ✅ Key Features

- Dynamic product listing and category navigation
- Customer profile, wishlist, and cart management
- Order creation and history support
- Review and rating submission
- Admin section for products, categories, orders, customers, messages, reviews
- MongoDB-powered persistent storage with Mongoose
- Clean and modern React UI using reusable components

## ⚙️ Setup Instructions

### Backend

1. Open a terminal and navigate to `Backend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create or verify `.env` in `Backend/` with your MongoDB connection string:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<database>?retryWrites=true&w=majority
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend

1. Open a terminal and navigate to `Frontend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```

## 🧪 Seeding the Database

The backend includes a seeding script that loads initial data from `db.json`.

Run it from the `Backend/` folder:
```bash
npm run seed
```

> Make sure `db.json` exists in the backend folder and matches the expected data structure.

## 🔐 Environment & Database Notes

- The backend now explicitly loads `Backend/.env` to avoid environment loading issues when starting from a different working directory.
- All data models rely on MongoDB `_id` as the single source of truth.
- The frontend receives JSON objects with a virtual `id` field mapped from `_id` for consistency.

## 📌 API Usage

The backend exposes a RESTful service for all application resources. Each resource supports standard CRUD operations and accepts JSON payloads.

### API Request Examples

- List items: use `GET` with optional query parameters for filtering, sorting, and limiting results.
- Read one item: use `GET` with the resource identifier.
- Create an item: send `POST` with the object body containing the required fields.
- Update an item: use `PATCH` or `PUT` with the identifier and the updated JSON payload.
- Delete an item: use `DELETE` with the identifier.

Authentication is required for protected operations. Include a bearer token in the header:

```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Data Model Diagram

The main entities are connected like this:

```text
Customer
  ├─> Orders
  │     └─> Products
  ├─> Addresses
  ├─> Reviews
  │     └─> Products
  └─> Messages

Product
  └─> Category
```

### Data Relationships

- Customers can place orders and store shipping addresses.
- Orders contain one or more products.
- Products are categorized for easier browsing.
- Customers can submit reviews for products.
- Messages represent customer support or admin communications.
- Admin data is used for protected dashboard operations.

This structure keeps the frontend and backend aligned while enabling secure access control for customer and admin operations.

## 💡 Best Practices

- Use MongoDB Atlas network access whitelisting or IP access rules if connecting remotely.
- Keep credentials out of version control by using `.env`.
- Re-seed only when you want to reset the backend demo data.

## 📚 Recommended Workflow

1. Start backend first
2. Confirm MongoDB connection logs
3. Start frontend
4. Open the local Vite app in the browser

## 🙌 Final Notes

This repository is built for a production-ready e-commerce pattern with separate client and server code. It is easy to extend with authentication, payment gateways, admin role control, logging, caching, and more.