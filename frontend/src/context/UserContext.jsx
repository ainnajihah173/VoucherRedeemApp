import React, { createContext, useState, useCallback } from 'react';
import axiosInstance from '../pages/axiosInstance';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      return;
    }
    try {
      const res = await axiosInstance.get('/users/profile');
      setUser(res.data);
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  }, []);

  // Update user points after redemption
  const updateUserPoints = useCallback((newPoints) => {
    setUser(prev => prev ? { ...prev, points: newPoints } : null);
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, fetchUser, updateUserPoints }}>
      {children}
    </UserContext.Provider>
  );
};
