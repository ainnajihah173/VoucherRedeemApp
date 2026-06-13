import React, { useState, useEffect, useCallback, useContext } from 'react';
import axiosInstance from './axiosInstance';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const Cart = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [userPoints, setUserPoints] = useState(0);
  const { updateUserPoints } = useContext(UserContext);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const fetchCart = useCallback(async () => {
    try {
      const res = await axiosInstance.get('/cart');
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Cart Error:', err.response?.data || err.message);
    }
  }, []);

  const fetchUserPoints = useCallback(async () => {
    try {
      const res = await axiosInstance.get('/users/profile');
      // Update state with points from the database
      setUserPoints(res.data.points || 0);
    } catch (err) {
      console.error('Error fetching points:', err);
    }
  }, []);

  useEffect(() => {
    if (token) {
      const loadData = async () => {
        setLoading(true);
        await Promise.all([fetchCart(), fetchUserPoints()]);
        setLoading(false);
      };
      loadData();
    } else {
      setLoading(false);
    }
  }, [token, fetchCart, fetchUserPoints]);

  const updateQty = async (id, quantity) => {
    if (quantity < 1) return;
    try {
      // Attempting PUT as it is a common standard for updates if PATCH 404s
      await axiosInstance.put(`/cart/${id}`, { quantity });
      await fetchCart(); // Re-fetch cart data to sync UI with DB
    } catch (err) {
      console.error('Update Qty Error:', err.response?.data || err.message);
      const errorMsg = err.response?.data?.message || 'Check if the backend route PATCH/PUT /api/cart/:id exists.';
      alert(`Failed to update quantity: ${errorMsg} (Status: ${err.response?.status})`);
    }
  };

  const removeItem = async (id) => {
    if (!window.confirm('Are you sure you want to remove this item?')) return;
    try {
      await axiosInstance.delete(`/cart/${id}`);
      await fetchCart();
    } catch (err) {
      console.error('Remove Item Error:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Remove failed. Ensure DELETE /api/cart/:id is implemented.');
    }
  };

  const handleRedeem = async () => {
    if (userPoints < totalPoints) {
      alert(`Insufficient balance! You have ${userPoints.toLocaleString()} pts, but this order costs ${totalPoints.toLocaleString()} pts.`);
      return;
    }

    setRedeeming(true);
    try {
      // Execute redemption - backend now handles calculation for security
      const res = await axiosInstance.post('/cart/redeem');
      
      // Update context with new points balance - Navbar will re-render instantly
      updateUserPoints(res.data.newBalance);
      setUserPoints(res.data.newBalance);
      setOrderSuccess(true);
      setItems([]);
    } catch (err) {
      console.error('Redeem Error:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Redemption failed. Check server logs.');
    } finally {
      setRedeeming(false);
    }
  };

  // Point calculation logic: $1 discount = 10 points
  const totalPoints = items.reduce((acc, item) => {
    const discount = item.voucher?.discountAmount || 0;
    return acc + (discount * 10 * item.quantity);
  }, 0);

  if (!token) return (
    <div className="pt-32 text-center min-h-screen bg-surface">
      <span className="material-symbols-outlined text-[64px] text-primary opacity-20">lock</span>
      <p className="text-body-lg mt-md text-on-surface-variant">Please login to view your cart.</p>
      <button onClick={() => navigate('/login')} className="mt-lg bg-primary text-on-primary px-xl py-md rounded-xl font-label-lg">Sign In</button>
    </div>
  );

  if (loading && !orderSuccess) return <div className="pt-32 text-center font-headline-md text-primary animate-pulse">Discovering your deals...</div>;

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen antialiased">
      {/* CSS logic for the voucher cut-out shape */}
      <style>
        {`
          .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; vertical-align: middle; }
          .voucher-cut { clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 60%, 4px 50%, 0% 40%); }
        `}
      </style>

      <main className="pt-32 pb-2xl px-gutter max-w-container-max mx-auto">
        {orderSuccess ? (
          <div className="py-2xl flex flex-col items-center text-center max-w-lg mx-auto">
            <div className="w-64 h-64 mb-lg relative">
              <div className="absolute inset-0 bg-primary opacity-5 rounded-full blur-3xl"></div>
              <img alt="Success" className="relative z-10 w-full h-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPufITwY3T0ByetanaUaSiBD91A82YxmZSo6Wuo98J-p_xyA1uzVtcpJ4BtsQahqfGuFPJNLdzcFpQIioeJ6Dre0sLlD7BhpoHPDzB1h4eTM17ow8-ICuVyDDWHMRDqy6ZIXQt5wLccex9z9I02LVlOSWtAMitw6TG2MmePXmv4iAA7pNOJeB8xYUjAFGcguzYgOB6jPL6R70CdrXd-XeBQw0sOphxonu_xOkedQcdIpfwqW4h1rXkPfliX5vUEt1Qt2A5psa6EyEW" />
            </div>
            <h2 className="font-display-sm text-display-sm text-primary mb-md">Order Successful!</h2>
            <p className="text-on-surface-variant text-body-lg mb-xl">
              Your vouchers have been sent to your email. Your new balance is <strong>{userPoints.toLocaleString()} pts</strong>.
            </p>
            <Link to="/history" className="bg-primary text-on-primary px-xl py-md rounded-full font-bold text-body-lg active:scale-95 transition-all">
              View Redemption History
            </Link>
          </div>
        ) : items.length === 0 ? (
          <div className="py-2xl flex flex-col items-center text-center max-w-lg mx-auto">
            <div className="w-64 h-64 mb-lg relative">
              <div className="absolute inset-0 bg-primary opacity-5 rounded-full blur-3xl"></div>
              <img alt="Empty Cart" className="relative z-10 w-full h-full object-contain mix-blend-multiply" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPufITwY3T0ByetanaUaSiBD91A82YxmZSo6Wuo98J-p_xyA1uzVtcpJ4BtsQahqfGuFPJNLdzcFpQIioeJ6Dre0sLlD7BhpoHPDzB1h4eTM17ow8-ICuVyDDWHMRDqy6ZIXQt5wLccex9z9I02LVlOSWtAMitw6TG2MmePXmv4iAA7pNOJeB8xYUjAFGcguzYgOB6jPL6R70CdrXd-XeBQw0sOphxonu_xOkedQcdIpfwqW4h1rXkPfliX5vUEt1Qt2A5psa6EyEW" />
            </div>
            <h2 className="font-display-sm text-display-sm text-primary mb-md">Your cart is empty</h2>
            <p className="text-on-surface-variant text-body-lg mb-xl">Looks like you haven't added any vouchers yet. Explore our top deals and start saving points!</p>
            <Link to="/" className="bg-primary hover:bg-surface-tint text-on-primary px-xl py-md rounded-full font-bold text-body-lg active:scale-95 transition-all">
              Browse Hot Deals
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-xl">
            {/* Cart Items Section */}
            <div className="flex-grow space-y-lg">
              <div className="flex items-center justify-between">
                <h1 className="font-headline-lg text-headline-lg text-primary">Shopping Cart</h1>
                <span className="text-on-surface-variant font-medium">{items.length} Items</span>
              </div>

              {items.map(item => (
                <div key={item._id} className="group relative bg-surface-container-lowest p-md rounded-xl shadow-sm hover:shadow-lg transition-all flex flex-col md:flex-row items-center gap-lg border border-outline-variant border-opacity-30 voucher-cut">
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-surface-container rounded-lg flex items-center justify-center p-md overflow-hidden shrink-0">
                    <span className="material-symbols-outlined text-primary text-[48px] opacity-20">confirmation_number</span>
                  </div>
                  <div className="flex-grow text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-xs mb-xs">
                      <span className="bg-surface-container px-sm py-1 rounded-full text-primary font-label-md capitalize">
                        {typeof item.voucher.category === 'object' ? item.voucher.category.name : 'Deal'}
                      </span>
                      <span className="text-error font-label-md flex items-center gap-xs">
                        <span className="material-symbols-outlined text-[14px]">timer</span> Expiring Soon
                      </span>
                    </div>
                    <h3 className="font-headline-md text-headline-md mb-xs">${item.voucher.discountAmount} Voucher</h3>
                    <p className="text-on-surface-variant text-body-sm">Exclusive code: {item.voucher.code}</p>
                  </div>
                  <div className="flex items-center gap-lg w-full md:w-auto justify-between md:justify-end">
                    <div className="flex flex-col items-end shrink-0">
                      <span className="text-secondary font-bold text-headline-md">{(item.voucher.discountAmount * 10).toLocaleString()} pts</span>
                      <span className="text-on-surface-variant text-label-md">per unit</span>
                    </div>
                    <div className="flex items-center bg-surface-container rounded-full p-xs border border-outline-variant">
                      <button 
                        disabled={item.quantity <= 1}
                        onClick={() => updateQty(item._id, Number(item.quantity) - 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-surface-container-high rounded-full transition-colors active:scale-90 disabled:opacity-30"
                      >-</button>
                      <span className="px-md font-bold">{item.quantity}</span>
                      <button 
                        onClick={() => updateQty(item._id, Number(item.quantity) + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-surface-container-high rounded-full transition-colors active:scale-90"
                      >+</button>
                    </div>
                    <button 
                      onClick={() => removeItem(item._id)}
                      className="material-symbols-outlined text-outline hover:text-error transition-colors p-sm"
                    >delete</button>
                  </div>
                </div>
              ))}

              <div className="flex items-center gap-sm mt-md p-md bg-primary-container bg-opacity-5 rounded-lg border-l-4 border-primary">
                <span className="material-symbols-outlined text-primary">info</span>
                <p className="text-body-sm text-on-surface-variant">Selected vouchers will be sent to your registered email immediately after points deduction.</p>
              </div>
            </div>

            {/* Points Summary Sidebar */}
            <aside className="w-full lg:w-[380px] shrink-0">
              <div className="sticky top-32 bg-surface-container-low p-lg rounded-xl border border-outline-variant shadow-sm space-y-lg">
                <h2 className="font-headline-md text-headline-md text-primary border-b border-outline-variant pb-md">Points Summary</h2>
                <div className="space-y-md">
                  <div className="flex justify-between items-center">
                    <span className="text-on-surface-variant">Current Balance</span>
                    <span className="font-bold text-body-lg">{userPoints.toLocaleString()} pts</span>
                  </div>
                  <div className="flex justify-between items-center text-error">
                    <span className="text-on-surface-variant">Total Cost</span>
                    <span className="font-bold text-body-lg">- {totalPoints.toLocaleString()} pts</span>
                  </div>
                  <div className="h-px bg-outline-variant my-md"></div>
                  <div className="flex justify-between items-center p-md bg-surface-container-highest rounded-lg">
                    <span className="font-bold text-primary">Remaining Balance</span>
                    <span className="font-display-sm text-display-sm text-primary">
                      {(userPoints - totalPoints).toLocaleString()} pts
                    </span>
                  </div>
                </div>

                <div className="space-y-md pt-md">
                  <div className="bg-surface-container rounded-xl p-md">
                    <p className="text-label-md text-outline uppercase tracking-wider mb-xs">Order Progress</p>
                    <div className="w-full bg-outline-variant h-2 rounded-full overflow-hidden">
                      <div className={`h-full bg-gradient-to-r from-secondary-container to-error transition-all duration-1000 ${redeeming ? 'w-full' : 'w-[75%]'}`}></div>
                    </div>
                    <p className="text-label-md text-on-surface-variant mt-sm">Vouchers expire in 2:45:12</p>
                  </div>

                  <button 
                    disabled={redeeming}
                    onClick={handleRedeem}
                    className={`w-full ${redeeming ? 'bg-surface-container text-outline' : 'bg-secondary-container hover:bg-secondary text-white'} py-md rounded-lg font-bold text-body-lg active:scale-95 transition-all shadow-lg flex items-center justify-center gap-sm group`}
                  >
                    {redeeming ? (
                      <><span className="material-symbols-outlined animate-spin">refresh</span> Processing...</>
                    ) : (
                      <>Place Order <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span></>
                    )}
                  </button>
                  <Link to="/" className="block text-center text-primary font-medium hover:underline text-body-sm">Continue Shopping</Link>
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;