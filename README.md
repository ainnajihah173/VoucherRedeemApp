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

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/voucherhub.git
cd voucherhub
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
```
Start the backend server:
```bash
npm start
```

### 3. Frontend Setup
Navigate to the frontend directory and install dependencies:
```bash
cd ../frontend
npm install
```
Create a `.env` file in the `frontend` folder:
```env
REACT_APP_API_URL=http://localhost:5000/api
```
Start the React development server:
```bash
npm start
```

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
