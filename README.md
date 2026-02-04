# AutoPulse - Smart Vehicle Health & Maintenance Platform

AutoPulse is a production-ready full-stack web application designed for car and bike owners to track their vehicle's health, mileage, and service intervals. It features a premium, modern automotive-themed UI using **Glassmorphism** and a **Dark Mode** aesthetic.

## 🚀 Status: Production Ready MVP

## 🛠 Tech Stack

### Frontend (Client)
- **React** (Vite)
- **Tailwind CSS** (v4 Styling & Glassmorphism)
- **Framer Motion** (Animations)
- **Lucide React** (Icons)
- **Axios** (API Communication)
- **React Router DOM** (Navigation)

### Backend (Server)
- **Node.js** & **Express**
- **MongoDB** (Database) & **Mongoose** (ODM)
- **JWT** (Authentication)
- **Bcrypt** (Password Hashing)

## ✨ Features

- **User Authentication**: Secure Login & Registration with JWT.
- **Garage Dashboard**: View all your vehicles with health indicators.
- **Smart Health Score**: 
  - Automatically calculated based on:
    - Mileage since last service (<3000km Good, <5000km Warning, >5000km Critical).
    - Vehicle Age (-2% per year over 5 years).
    - Reported Issues.
- **Service History**: Log maintenance records (Date, Mileage, Cost, Notes).
- **Vehicle Management**: Add, Edit, Delete, and View details.
- **Responsive Design**: Mobile-first, beautiful dark UI.

## 📦 Setup Instructions

### 1. Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - File `.env` is already configured with default local settings.
   - `MONGO_URI=mongodb://localhost:27017/autopulse`
   - `JWT_SECRET=autopulse_super_secure_secret`
4. Run the database seeder (optional, adds dummy data):
   ```bash
   node seeder.js
   ```
   *Created User: `john@example.com` / `password123`*
5. Start the server:
   ```bash
   npm run dev
   ```
   (Runs on port 5000)

### 2. Frontend Setup

1. Open a new terminal and navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser at `http://localhost:5173`.

## 📸 Screenshots
*(Use the app to see the beautiful glassmorphism interface!)*

## 🛡 API Endpoints

- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/vehicles` - Get all user vehicles
- `POST /api/vehicles` - Add vehicle
- `GET /api/vehicles/:id` - Get vehicle details
- `POST /api/vehicles/:id/services` - Add service record
