import React, { useState, useEffect } from 'react';
import axiosInstance from './axiosInstance';
import { Link, useNavigate } from 'react-router-dom';
import '../index.css';

const Home = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!process.env.REACT_APP_API_URL) {
          console.error('API URL is not defined. Check your .env file and restart the server.');
          setError('Configuration error: API URL missing.');
          setLoading(false);
          return;
        }
        setLoading(true);
        const voucherRes = await axiosInstance.get('/vouchers').catch(e => ({ data: [] }));
        
        console.log('Data fetched:', { vouchers: voucherRes.data });

        setVouchers(Array.isArray(voucherRes.data) ? voucherRes.data : []);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddToCart = async (e, voucherId) => {
    e.preventDefault();
    e.stopPropagation();
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      await axiosInstance.post('/cart', { voucherId, quantity: 1 });
      alert('Voucher added to cart!');
      
    } catch (err) {
      console.error('Cart Error:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Error adding to cart');
      // Global interceptor handles 401
    }
  };

  // Helper to calculate days remaining
  const getDaysLeft = (date) => {
    const diff = new Date(date) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? `${days}d left` : 'Expired';
  };

  // Define Hot Deals as vouchers with discount >= 25% or specific high-value items
  const hotDeals = vouchers
    .filter(v => v.discountAmount >= 25)
    .slice(0, 6);

  if (loading) return <div className="loading">Loading vouchers...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="bg-surface text-on-surface font-body-md antialiased min-h-screen">
      <style>
        {`
          .voucher-card-mask {
              mask-image: radial-gradient(circle at 100% 50%, transparent 12px, black 13px), radial-gradient(circle at 0% 50%, transparent 12px, black 13px);
              mask-position: right top, left top;
              mask-size: 100% 100%;
          }
          .voucher-separator {
              background-image: linear-gradient(to bottom, #c3c6d7 50%, rgba(255,255,255,0) 0%);
              background-position: center;
              background-size: 1px 10px;
              background-repeat: repeat-y;
          }
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}
      </style>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative h-[480px] flex items-center overflow-hidden bg-inverse-surface">
          <img 
            alt="Hero background" 
            className="absolute inset-0 w-full h-full object-cover opacity-40" 
            src="https://images.unsplash.com/photo-1555421689-491a97ff2040?q=80&w=2070&auto=format&fit=crop" 
          />
          <div className="relative z-10 max-w-container-max mx-auto px-gutter w-full">
            <div className="max-w-2xl">
              <h1 className="font-display-lg text-display-lg text-on-primary mb-md">Exclusive Hot Deals.</h1>
              <p className="font-body-lg text-body-lg text-on-primary-container opacity-90 mb-xl">Our most aggressive discounts, curated just for you. Grab them before they're gone.</p>
              <Link to="/categories" className="bg-primary text-on-primary px-xl py-md rounded-lg font-label-lg text-label-lg hover:bg-surface-tint active:scale-95 transition-all inline-block">
                Browse All Categories
              </Link>
            </div>
          </div>
        </section>

        {/* Grid Layout of Vouchers */}
        <section className="max-w-container-max mx-auto px-gutter py-2xl">
          <div className="flex justify-between items-end mb-xl">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface">Featured Hot Deals</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-xs">The highest point-value savings available now.</p>
            </div>
            <div className="font-label-lg text-label-lg text-on-surface-variant">
              Limited availability
            </div>
          </div>

          {hotDeals.length === 0 && !loading ? (
            <div className="text-center py-2xl bg-surface-container-low rounded-xl">
              <span className="material-symbols-outlined text-[64px] text-outline-variant">search_off</span>
              <p className="font-body-lg text-on-surface-variant mt-md">No vouchers found matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-xl">
              {hotDeals.map(voucher => (
                <Link to={`/voucher/${voucher._id}`} key={voucher._id} className="group bg-surface-bright rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex h-48 border border-outline-variant/30">
                  <div className="w-1/3 p-md flex flex-col items-center justify-center bg-surface-container-low">
                    <div className="w-16 h-16 bg-white rounded-lg p-sm shadow-sm mb-sm flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-[32px]">confirmation_number</span>
                    </div>
                    <span className="font-label-md text-label-md text-on-surface-variant text-center truncate w-full px-xs">
                      {voucher.code}
                    </span>
                  </div>
                  <div className="w-px h-full voucher-separator"></div>
                  <div className="flex-1 p-md flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="bg-primary-container/10 text-primary px-sm py-xs rounded font-label-md text-label-md">
                          {typeof voucher.category === 'object' ? voucher.category.name : 'Deal'}
                        </span>
                        <span className="font-label-md text-label-md text-error flex items-center gap-xs">
                          <span className="material-symbols-outlined text-[14px]">timer</span> {getDaysLeft(voucher.expiryDate)}
                        </span>
                      </div>
                      <h3 className="font-headline-md text-headline-md mt-sm">${voucher.discountAmount} OFF</h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1">Limited time discount code.</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="font-label-md text-label-md text-on-surface-variant text-primary">Point</span>
                        <span className="font-headline-md text-headline-md text-primary">Save</span>
                      </div>
                      <button 
                        onClick={(e) => handleAddToCart(e, voucher._id)}
                        className="bg-secondary text-on-secondary px-lg py-sm rounded-lg font-label-lg text-label-lg active:scale-95 transition-all shadow-md shadow-secondary/20 hover:bg-secondary-container"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Urgent Vouchers Section */}
          <div className="mt-2xl grid grid-cols-1 lg:grid-cols-12 gap-xl">
            <div className="lg:col-span-4 bg-error text-on-error p-xl rounded-xl relative overflow-hidden group">
              <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <span className="material-symbols-outlined text-[160px]" style={{ fontVariationSettings: "'FILL' 1" }}>timer</span>
              </div>
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <span className="bg-white/20 px-sm py-xs rounded font-label-md text-label-md uppercase tracking-wider">Expiring Soon</span>
                  <h2 className="font-display-sm text-display-sm mt-md">Final Hours to Redeem.</h2>
                  <p className="font-body-md text-body-md mt-sm opacity-90">Don't let your high-value points expire! Grab these premium vouchers before they vanish.</p>
                </div>
                <button className="mt-xl bg-white text-error w-fit px-xl py-md rounded-lg font-label-lg text-label-lg hover:bg-surface-bright transition-colors shadow-lg">Show Countdown Deals</button>
              </div>
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-lg">
              <div className="bg-surface-container-highest p-lg rounded-xl flex flex-col justify-between border border-outline-variant">
                <div className="flex justify-between items-start mb-md">
                  <div>
                    <p className="text-primary font-label-md text-label-md font-bold">Featured Partner</p>
                    <h3 className="font-headline-md text-headline-md">Flash Sale Brand</h3>
                  </div>
                  <div className="bg-error-container text-on-error-container px-sm py-xs rounded text-label-md font-bold">30% OFF</div>
                </div>
                <div className="bg-surface-bright p-sm rounded border border-outline-variant flex items-center justify-between mb-md">
                  <span className="font-code text-code text-on-surface pl-sm font-mono">FLASH-SALE-2024</span>
                  <button className="bg-primary text-on-primary px-md py-sm rounded font-label-lg text-label-lg">Copy</button>
                </div>
                <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-secondary to-error w-[85%]"></div>
                </div>
                <p className="font-label-md text-label-md text-on-surface-variant mt-sm">Only 15 vouchers remaining</p>
              </div>
              <div className="bg-surface-container-highest p-lg rounded-xl flex flex-col justify-between border border-outline-variant">
                <div className="flex justify-between items-start mb-md">
                  <div>
                    <p className="text-primary font-label-md text-label-md font-bold">New Arrival</p>
                    <h3 className="font-headline-md text-headline-md">Premium Store</h3>
                  </div>
                  <div className="bg-error-container text-on-error-container px-sm py-xs rounded text-label-md font-bold">$20 Credit</div>
                </div>
                <div className="bg-surface-bright p-sm rounded border border-outline-variant flex items-center justify-between mb-md">
                  <span className="font-code text-code text-on-surface pl-sm font-mono">PREMIUM-REDEEM</span>
                  <button className="bg-primary text-on-primary px-md py-sm rounded font-label-lg text-label-lg">Copy</button>
                </div>
                <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-secondary to-error w-[95%]"></div>
                </div>
                <p className="font-label-md text-label-md text-on-surface-variant mt-sm">Only 3 vouchers remaining</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-low border-t border-outline-variant w-full py-xl mt-xl">
        <div className="max-w-container-max mx-auto px-gutter grid grid-cols-1 md:grid-cols-4 gap-lg">
          <div className="col-span-1 md:col-span-1">
            <span className="font-headline-md text-headline-md font-bold text-primary">VoucherHub</span>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-md">The most reliable platform for point-to-voucher exchanges. Maximize your loyalty value with ease.</p>
          </div>
          <div>
            <h4 className="font-label-lg text-label-lg text-on-surface mb-md">Company</h4>
            <ul className="space-y-sm">
              <li><button className="font-body-sm text-body-sm text-on-surface-variant hover:text-secondary underline transition-all">About Us</button></li>
              <li><button className="font-body-sm text-body-sm text-on-surface-variant hover:text-secondary underline transition-all">Terms of Service</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-label-lg text-label-lg text-on-surface mb-md">Support</h4>
            <ul className="space-y-sm">
              <li><button className="font-body-sm text-body-sm text-on-surface-variant hover:text-secondary underline transition-all">Help Center</button></li>
              <li><button className="font-body-sm text-body-sm text-on-surface-variant hover:text-secondary underline transition-all">Partner With Us</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-label-lg text-label-lg text-on-surface mb-md">Newsletter</h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-md">Get notified about the hottest deals.</p>
            <div className="flex gap-xs">
              <input className="bg-surface-bright border border-outline-variant rounded px-sm py-xs w-full text-body-sm" placeholder="Email" type="email"/>
              <button className="bg-primary text-on-primary p-xs rounded hover:bg-surface-tint flex items-center justify-center">
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-container-max mx-auto px-gutter mt-xl pt-lg border-t border-outline-variant/30 text-center">
          <p className="font-body-sm text-body-sm text-on-surface-variant">© 2024 VoucherHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;