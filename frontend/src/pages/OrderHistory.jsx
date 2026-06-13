import React, { useState, useEffect } from 'react';
import axiosInstance from './axiosInstance';

const OrderHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axiosInstance.get('/cart/history');
        setHistory(res.data);
      } catch (err) {
        console.error('History Error:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchHistory();
  }, [token]);

  if (loading) return <div className="pt-24 text-center">Loading History...</div>;

  return (
    <div className="pt-24 pb-2xl px-gutter max-w-container-max mx-auto min-h-screen">
      <header className="mb-xl">
        <h1 className="font-display-sm text-display-sm text-primary">My Redeemed Vouchers</h1>
        <p className="text-on-surface-variant mt-sm">A list of all your claimed savings and discount codes.</p>
      </header>

      {history.length === 0 ? (
        <div className="text-center py-2xl bg-surface-container rounded-2xl">
          <p className="text-on-surface-variant font-body-lg">You haven't redeemed any vouchers yet.</p>
        </div>
      ) : (
        <div className="space-y-md">
          {history.map((order) => (
            <div key={order._id} className="bg-surface-bright p-lg rounded-2xl border border-outline-variant flex flex-col md:flex-row justify-between items-center gap-lg">
              <div className="flex items-center gap-md w-full md:w-auto">
                <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined">check_circle</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-headline-md">${order.voucher?.discountAmount} Off Voucher</h3>
                  <p className="text-body-sm text-on-surface-variant">Redeemed on {new Date(order.timestamp).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="bg-surface-container px-lg py-md rounded-xl border border-dashed border-outline-variant w-full md:w-auto text-center">
                <span className="font-code text-code text-primary uppercase tracking-widest">{order.voucher?.code}</span>
                <p className="text-[10px] text-on-surface-variant font-bold uppercase mt-xs">Active Code</p>
              </div>
              <div className="text-right">
                <span className="bg-surface-container-highest px-md py-xs rounded-full font-label-md text-label-md">Qty: {order.quantity}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default OrderHistory;