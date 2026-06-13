# 🎟️ VoucherHub

VoucherHub is a modern MERN stack application that allows users to exchange loyalty points for premium digital vouchers. Featuring a sleek, Bento-style UI inspired by Material Design 3, the platform provides a seamless experience for discovering deals, managing a cart, and redeeming savings.

## 🚀 Features

-   **Dynamic Points System**: New users are credited with **1,000 points** upon registration.
-   **Secure Authentication**: JWT-based authentication with custom Axios interceptors for global session management.
-   **Bento-Style UI**: Modern, responsive interface built with Tailwind CSS, featuring custom voucher-cut visual effects and glassmorphism.
-   **Real-time Calculations**: Points are calculated at a rate of **10 pts per $1 discount**.
-   **Server-Side Validation**: All point deductions and redemptions are validated on the backend to prevent unauthorized transactions.
-   **Redemption History**: Track all claimed vouchers and active codes in a dedicated history view.
-   **Smart Filtering**: Browse vouchers by category or search via the dynamic category explorer.

## 🛠️ Tech Stack

**Frontend:**
-   React.js
-   Tailwind CSS (Custom Configuration)
-   Axios (Centralized Instance & Interceptors)
-   Context API (State Management for User Points)
-   React Router DOM

**Backend:**
-   Node.js & Express
-   MongoDB & Mongoose
-   JSON Web Tokens (JWT)
-   Bcrypt.js (Password Hashing)
-   Dotenv (Environment Management)

## 📦 Installation & Setup

1. Clone the repository.
2. Navigate to the backend folder: cd backend.
3. Install dependencies: npm install.
4. Create a .env file with PORT, MONGO_URI, and JWT_SECRET.
5. Seed the database: node seed.js.
6. Start the server: npm run dev.
7. Navigate to the frontend folder: cd frontend.
8. Install dependemcies: npm install.
9. Create a .env file with REACT_APP_API_UR.
10. Start the frontend: npm start.

## 🔐 Security Features

-   **Environment Protection**: Sensitive API keys and database strings are managed via `.env` and excluded from version control.
-   **Auth Interceptors**: Frontend automatically handles `401 Unauthorized` responses by clearing local tokens and redirecting to login.
-   **Input Validation**: Backend strictly validates point balances before allowing redemption to prevent "double-spending" or negative balances.
-   **Protected Routes**: API endpoints for cart and profile are protected by custom JWT middleware.

## 📄 API Endpoints (Quick Reference)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/users/register` | Register new user (+1000 pts) |
| `POST` | `/api/users/login` | User login / Get JWT |
| `GET` | `/api/users/profile` | Get user point balance |
| `GET` | `/api/vouchers` | Fetch all available vouchers |
| `GET` | `/api/cart` | Get current user cart items |
| `POST` | `/api/cart/redeem` | Process point deduction & checkout |
| `GET` | `/api/cart/history` | View redeemed voucher codes |

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---
Developed with ❤️ by AJ
