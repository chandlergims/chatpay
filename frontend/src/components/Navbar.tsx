import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import { isAuthenticated, logout, getUser, User } from '../services/authService';

const Navbar = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if user is authenticated
    const authStatus = isAuthenticated();
    setIsLoggedIn(authStatus);
    
    if (authStatus) {
      // Get user data from localStorage
      const userData = getUser();
      setUser(userData);
    }
  }, []);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setUser(null);
    setIsDropdownOpen(false);
    // Reload the page to update the UI
    window.location.reload();
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="navbar-logo-text">QF</span>
          <img src="/logo.png" alt="QueryFi Logo" className="navbar-logo-img" />
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/how-it-works" className="nav-link">
              How It Works
            </Link>
          </li>
          {isLoggedIn && (
            <>
              <li className="nav-item">
                <Link to="/inbox" className="nav-link">
                  Messages
                </Link>
              </li>
            </>
          )}
          <li className="nav-item">
            <a 
              href="https://x.com/chatrrdotfun" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="nav-link social-link"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                width="20" 
                height="20" 
                className="twitter-icon"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </li>
        </ul>
        <div className="auth-buttons">
          {isLoggedIn ? (
            <div className="user-dropdown" ref={dropdownRef}>
              <div 
                className="user-greeting" 
                onClick={toggleDropdown}
              >
                Hello, {user?.username}
                <span className="dropdown-arrow">▼</span>
              </div>
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/profile" className="dropdown-item">
                    My Profile
                  </Link>
                  <div 
                    className="dropdown-item"
                    onClick={handleLogout}
                  >
                    Logout
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <button 
                className="auth-button login-button"
                onClick={() => setIsLoginModalOpen(true)}
              >
                Login
              </button>
              <button 
                className="auth-button register-button"
                onClick={() => setIsRegisterModalOpen(true)}
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>

      {/* Always render modals but control visibility with isOpen prop */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
      <RegisterModal 
        isOpen={isRegisterModalOpen} 
        onClose={() => setIsRegisterModalOpen(false)} 
      />
    </nav>
  );
};

export default Navbar;
