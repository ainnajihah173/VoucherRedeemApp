import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Categories from './pages/Categories';
import OrderHistory from './pages/OrderHistory';
import VoucherDetail from './pages/VoucherDetail';
import Navbar from './components/Navbar';
import { UserProvider } from './context/UserContext';

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="App min-h-screen bg-surface font-sans">
          <Navbar />
          <Routes>
            {/* Setting path="/" makes Home.jsx the default page */}
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/voucher/:id" element={<VoucherDetail />} />
            <Route path="/history" element={<OrderHistory />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
