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
          <img src="/logo.png" alt="Chatrr Logo" className="navbar-logo-img" />
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
