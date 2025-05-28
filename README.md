# 🏡 Property Listing Backend API

A powerful and efficient backend service for property listings, built using **Node.js**, **Express.js**, **MongoDB**, and **Redis**. The API supports property CRUD operations, advanced filtering, authentication, favorites, CSV import, and optional features like recommendations.

---

## 🚀 Features

- 🔐 User authentication with roles
- 🏘️ CRUD operations for property listings
- 🔍 Advanced filtering by price, location, amenities, etc.
- ❤️ Add/remove favorite properties
- 📦 Bulk property import from CSV
- ⚡ Redis caching for performance
- 🧠 (Optional) Property recommendation engine
- 🌐 Caddy reverse proxy ready

---

## 🛠️ Tech Stack

- **Node.js** + **Express.js** – Server framework  
- **MongoDB** – Primary database  
- **Mongoose** – ODM for MongoDB  
- **Redis** – Caching layer (optional)  
- **Caddy** – Reverse proxy and HTTPS  
- **CSV-parser** – For importing CSV data  

---


## API Routes

### User Routes
- `POST /user/register`
- `POST /user/login`
- `POST /user/logout`
- `GET /user/details`

### Property Routes
- `GET /property/get-all`
- `GET /property/get-user-properties`
- `DELETE /property/delete/:id`
- `PUT /property/update/:id`

### Favorite Routes
- `POST /favorite/add`
- `GET /favorite/get-all`
- `DELETE /favorite/delete/:id`

### Search Routes
- `GET /search/?`

### Recommendation Routes
- `GET /recommend/get-all`
- `POST /recommend/recommend-property`

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
MONGO_URI=mongodb://localhost:27017/propertyDB

