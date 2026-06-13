import React, { useState } from 'react';
import axiosInstance from './axiosInstance';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/users/register', formData);
      alert('Welcome to VoucherHub! Registration successful and 1,000 points have been credited to your account.');
      navigate('/login');
    } catch (err) {
      console.error('Registration Error:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Registration failed. Please check your connection or try a different email/username.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 bg-surface">
      <div className="w-full max-w-md bg-surface-bright p-2xl rounded-2xl shadow-xl border border-outline-variant">
        <div className="text-center mb-xl">
          <h1 className="font-display-sm text-display-sm text-primary">Start Saving</h1>
          <p className="text-on-surface-variant mt-sm">Join VoucherHub and redeem your points</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-lg">
          <div>
            <label className="font-label-lg text-on-surface block mb-sm">Username</label>
            <input 
              type="text" 
              required
              className="w-full bg-surface-container px-md py-md rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              placeholder="john_doe"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
          </div>
          <div>
            <label className="font-label-lg text-on-surface block mb-sm">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full bg-surface-container px-md py-md rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="font-label-lg text-on-surface block mb-sm">Password</label>
            <input 
              type="password" 
              required
              className="w-full bg-surface-container px-md py-md rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-primary text-on-primary py-md rounded-xl font-label-lg shadow-lg hover:bg-surface-tint active:scale-[0.98] transition-all"
          >
            Create Account
          </button>
        </form>
        <p className="text-center mt-xl text-body-sm text-on-surface-variant">
          Already a member? <Link to="/login" className="text-primary font-bold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;