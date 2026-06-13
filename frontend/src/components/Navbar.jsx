import React, { useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, fetchUser } = useContext(UserContext);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token, fetchUser]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;
  const linkClass = (path) => 
    `font-medium font-body-md text-body-md transition-colors duration-200 pb-1 ${
      isActive(path) 
      ? 'text-primary border-b-2 border-primary font-bold' 
      : 'text-on-surface-variant hover:text-primary'
    }`;

  return (
    <header className="fixed top-0 w-full z-50 bg-surface-bright shadow-sm border-b border-outline-variant">
      <nav className="flex justify-between items-center h-20 px-gutter max-w-container-max mx-auto">
        <div className="flex items-center gap-xl">
          <Link to="/" className="font-display-sm text-display-sm font-extrabold text-primary">VoucherHub</Link>
          <div className="hidden md:flex items-center gap-lg">
            <Link to="/" className={linkClass('/')}>Hot Deals</Link>
            <Link to="/categories" className={linkClass('/categories')}>Categories</Link>
            {token && <Link to="/history" className={linkClass('/history')}>My Vouchers</Link>}
          </div>
        </div>
        <div className="flex items-center gap-md">
          {!token ? (
            <div className="flex gap-md">
              <Link to="/login" className="text-primary font-label-lg py-sm px-lg hover:bg-primary-container/10 rounded-lg transition-all">Login</Link>
              <Link to="/register" className="bg-primary text-on-primary px-xl py-sm rounded-lg font-label-lg shadow-md hover:bg-surface-tint transition-all">Join Free</Link>
            </div>
          ) : (
            <div className="flex items-center gap-md">
              {user && (
                <div className="hidden sm:flex items-center gap-xs bg-primary/10 px-md py-xs rounded-full border border-primary/20">
                  <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                  <span className="font-bold text-primary font-label-lg">{user.points?.toLocaleString()} Pts</span>
                </div>
              )}
              <Link to="/cart" className={`flex items-center gap-sm px-sm py-xs rounded-full cursor-pointer transition-colors ${isActive('/cart') ? 'bg-primary text-on-primary' : 'bg-surface-container-high hover:bg-surface-container-highest'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isActive('/cart') ? 'bg-white text-primary' : 'bg-primary-container text-on-primary-container'}`}>
                  <span className="material-symbols-outlined text-sm">shopping_cart</span>
                </div>
                <span className="font-label-lg text-label-lg pr-xs">Cart</span>
              </Link>
              <div className="h-8 w-[1px] bg-outline-variant mx-xs"></div>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-xs text-error font-label-lg hover:bg-error-container/20 p-sm rounded-lg transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;