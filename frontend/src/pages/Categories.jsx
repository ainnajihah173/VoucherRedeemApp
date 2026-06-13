import React, { useState, useEffect } from 'react';
import axiosInstance from './axiosInstance';
import { Link, useNavigate } from 'react-router-dom';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!process.env.REACT_APP_API_URL) {
          console.error('API URL is not defined.');
          setLoading(false);
          return;
        }
        const [catRes, voucherRes] = await Promise.all([
          axiosInstance.get('/categories'),
          axiosInstance.get('/vouchers')
        ]);
        setCategories(catRes.data);
        setVouchers(voucherRes.data);
      } catch (err) {
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
      alert(err.response?.data?.message || 'Error adding to cart');
      // Global interceptor handles 401
    }
  };

  const getDaysLeft = (date) => {
    const diff = new Date(date) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? `${days}d left` : 'Expired';
  };

  const filteredVouchers = vouchers.filter(v => {
    const matchesCategory = selectedCategory === 'all' || v.category?._id === selectedCategory || v.category === selectedCategory;
    const matchesSearch = (v.code || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) return <div className="pt-24 text-center">Discovering deals...</div>;

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
        <section className="relative h-[400px] flex items-center overflow-hidden bg-inverse-surface">
          <img 
            alt="Categories Hero" 
            className="absolute inset-0 w-full h-full object-cover opacity-30" 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop" 
          />
          <div className="relative z-10 max-w-container-max mx-auto px-gutter w-full">
            <div className="max-w-2xl">
              <h1 className="font-display-lg text-display-lg text-on-primary mb-md">Explore All Categories.</h1>
              <p className="font-body-lg text-body-lg text-on-primary-container opacity-90 mb-xl">Filter through our extensive catalog of vouchers from global brands.</p>
              <div className="flex flex-col sm:flex-row gap-sm p-sm bg-surface-bright rounded-xl shadow-lg max-w-xl">
                <div className="flex-1 flex items-center px-md border-r border-outline-variant">
                  <span className="material-symbols-outlined text-primary mr-sm">search</span>
                  <input 
                    className="w-full border-none focus:ring-0 font-body-md text-body-md bg-transparent" 
                    placeholder="Search vouchers..." 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button className="bg-primary text-on-primary px-xl py-md rounded-lg font-label-lg text-label-lg transition-all">Apply Filter</button>
              </div>
            </div>
          </div>
        </section>

        {/* Sticky Filter Bar */}
        <section className="bg-surface-bright sticky top-20 z-40 border-b border-outline-variant">
          <div className="max-w-container-max mx-auto px-gutter py-md flex items-center gap-md overflow-x-auto no-scrollbar">
            <button 
              onClick={() => setSelectedCategory('all')}
              className={`flex-none px-xl py-sm rounded-full font-label-lg text-label-lg transition-all ${selectedCategory === 'all' ? 'bg-primary text-on-primary' : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'}`}
            >
              All Vouchers
            </button>
            {categories.map(cat => (
              <button 
                key={cat._id}
                onClick={() => setSelectedCategory(cat._id)}
                className={`flex-none px-xl py-sm rounded-full font-label-lg text-label-lg flex items-center gap-sm transition-all ${selectedCategory === cat._id ? 'bg-primary text-on-primary' : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'}`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {cat.name.includes('Food') ? 'restaurant' : cat.name.includes('Travel') ? 'flight_takeoff' : cat.name.includes('Tech') ? 'devices' : 'label'}
                </span> 
                {cat.name}
              </button>
            ))}
          </div>
        </section>

        <section className="max-w-container-max mx-auto px-gutter py-2xl">
          <div className="flex justify-between items-end mb-xl">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface">Available Deals</h2>
              <p className="text-on-surface-variant mt-xs">Showing {filteredVouchers.length} vouchers in {selectedCategory === 'all' ? 'all categories' : 'selected category'}.</p>
            </div>
          </div>

          {filteredVouchers.length === 0 ? (
            <div className="text-center py-2xl bg-surface-container-low rounded-xl">
              <span className="material-symbols-outlined text-[64px] text-outline-variant">search_off</span>
              <p className="font-body-lg text-on-surface-variant mt-md">No deals found here yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-xl">
              {filteredVouchers.map(voucher => (
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
                        <span className="bg-primary-container/10 text-primary px-sm py-xs rounded font-label-md text-label-md lowercase">
                          {typeof voucher.category === 'object' ? voucher.category.name : 'Voucher'}
                        </span>
                        <span className="font-label-md text-label-md text-error flex items-center gap-xs">
                          <span className="material-symbols-outlined text-[14px]">timer</span> {getDaysLeft(voucher.expiryDate)}
                        </span>
                      </div>
                      <h3 className="font-headline-md text-headline-md mt-sm">${voucher.discountAmount} Voucher</h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1">Limited time redemption.</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="font-label-md text-label-md text-on-surface-variant">Cost</span>
                        <span className="font-headline-md text-headline-md text-primary">{voucher.discountAmount * 10} Pts</span>
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
        </section>
      </main>
    </div>
  );
};

export default Categories;