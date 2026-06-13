import React, { useState } from 'react';
import axiosInstance from './axiosInstance';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post('/users/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      console.error('Login Error:', err.response?.data || err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 bg-surface">
      <div className="w-full max-w-md bg-surface-bright p-2xl rounded-2xl shadow-xl border border-outline-variant">
        <div className="text-center mb-xl">
          <h1 className="font-display-sm text-display-sm text-primary">Welcome Back</h1>
          <p className="text-on-surface-variant mt-sm">Login to access your premium vouchers</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-lg">
          <div>
            <label className="font-label-lg text-on-surface block mb-sm">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full bg-surface-container px-md py-md rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="font-label-lg text-on-surface block mb-sm">Password</label>
            <input 
              type="password" 
              required
              className="w-full bg-surface-container px-md py-md rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-primary text-on-primary py-md rounded-xl font-label-lg shadow-lg hover:bg-surface-tint active:scale-[0.98] transition-all"
          >
            Sign In
          </button>
        </form>
        <p className="text-center mt-xl text-body-sm text-on-surface-variant">
          Don't have an account? <Link to="/register" className="text-primary font-bold hover:underline">Create one free</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;