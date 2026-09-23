# MERN Portfolio Builder 🚀

A full-stack web application designed to help developers and designers effortlessly build, host, and manage their personal portfolios. Built securely using the MERN stack (MongoDB, Express, React, Node.js). 

## 🌟 Core Features

### For Users 🧑‍💻
- **Secure Authentication:** JWT-based login/registration with bcrypt hashed passwords.
- **Dynamic Portfolio Creation:** Form-based portfolio building (Bio, Skills, Projects, Experience, Social Links).
- **Persistent Sessions:** Stays logged in even after browser refresh.
- **Public Showcasing:** Every portfolio gets a unique sharable link (`/portfolio/:userId`).

### For Administrators 🛡️
- **Admin Dashboard:** Access detailed metrics (Total Users, Total Portfolios).
- **Advanced Pagination:** Efficiently browse all registered users chunk-by-chunk (using MongoDB `skip` and `limit` for massive performance).
- **Full Moderation:** Delete offensive users or edit any user's portfolio directly from the portal.
- **Self-Management:** Dedicated tab to change admin password securely.

---

## 🛠️ Technology Stack
* **Frontend:** React.js, Vite, Axios, React Router v7, HTML/CSS (Glassmorphism UI).
* **Backend:** Node.js, Express.js.
* **Database:** MongoDB (Mongoose ORM).
* **Security:** JSON Web Tokens (JWT) & bcryptjs for password hashing.

---

## 🚦 Getting Started

### 1. Backend Setup
1. Open a terminal and navigate to the `backend/` folder.
2. Run `npm install` to install necessary Node modules (express, mongoose, bcryptjs, cors, jsonwebtoken, etc).
3. Create a `.env` file inside the `backend` folder and add:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/portfolio_builder
   JWT_SECRET=supersecretjwtkey_change_me
   ```
4. Start MongoDB compass/server locally. 
5. Start the backend: `npm start` (or `node server.js`). 
   *Note: On the first successful run, a default admin will automatically be generated in your database:*
   - **Admin Email:** admin@admin.com
   - **Admin Password:** admin123

### 2. Frontend Setup
1. Open a new terminal and navigate to the `frontend/` folder.
2. Run `npm install` to install React libraries (vite, axios, react-router-dom, etc).
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Access the application on `http://localhost:5173/`.

---

## 🔗 API Documentation (Thunder Client Configured)

| Module | Route | Method | Access | Notes |
|--------|-------|--------|--------|-------|
| **Auth** | `/api/auth/register` | `POST` | Public | Body: name, email, password |
| **Auth** | `/api/auth/login` | `POST` | Public | Returns auth *token* |
| **Auth** | `/api/auth/profile` | `GET` | Private | Use Bearer Token |
| **Portfolio** | `/api/portfolio/my-portfolio`| `POST` | Private | Creates/Updates user's portfolio |
| **Portfolio** | `/api/portfolio/my-portfolio`| `GET` | Private | Auto-fetches logged-in user portfolio |
| **Portfolio** | `/api/portfolio/user/:id` | `GET` | Public | Displays generated portfolio card |
| **Admin** | `/api/admin/stats` | `GET` | Admin | Returns system metrics |
| **Admin** | `/api/admin/users?page=1&limit=5` | `GET` | Admin | Fetches paginated user list |
| **Admin** | `/api/admin/change-password` | `PUT` | Admin | Update root admin password |
