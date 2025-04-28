import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaLinkedin, FaGoogle, FaInstagram, FaEnvelope, FaPhone, FaSearch, FaUserCircle, FaChevronDown } from "react-icons/fa";
import AuthModal from "./AuthModal";

export default function Header() {
  const [isAuthOpen, setAuthOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);
  const [searchFocused, setSearchFocused] = useState(false);

  const [contactDetails, setContactDetails] = useState({
    email: "support@carrental.com",
    phone: "+1 (555) 123-4567",
  });

  useEffect(() => {
    fetch("http://localhost:5000/contact-details")
      .then((response) => response.json())
      .then((data) => setContactDetails(data))
      .catch((error) => {
        console.error("Error fetching contact details:", error);
        // Fallback data
        setContactDetails({
          email: "support@carrental.com",
          phone: "+1 (555) 123-4567",
        });
      });
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/user", { credentials: "include" });
        const data = await response.json();
        if (response.ok) {
          setUser(data);
        } else {
          console.error("Error fetching user:", data.error);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        setUser(null);
        window.location.href = "/";
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <header className="header-container">
      {/* Top Bar */}
      <div className="top-bar">
        <div className="container">
          <div className="contact-info">
            <div className="contact-item">
              <FaEnvelope className="icon email-icon" />
              <div className="contact-text">
                <span className="contact-label">FOR SUPPORT MAIL US</span>
                <span className="contact-value">{contactDetails.email}</span>
              </div>
            </div>
            <div className="contact-item">
              <FaPhone className="icon phone-icon" />
              <div className="contact-text">
                <span className="contact-label">SERVICE HELPLINE CALL US</span>
                <span className="contact-value">{contactDetails.phone}</span>
              </div>
            </div>
          </div>
          
          <div className="social-auth">
            <div className="social-icons">
              <a href="#" className="social-icon facebook"><FaFacebook /></a>
              <a href="#" className="social-icon twitter"><FaTwitter /></a>
              <a href="#" className="social-icon linkedin"><FaLinkedin /></a>
              <a href="#" className="social-icon instagram"><FaInstagram /></a>
            </div>
            {!user && (
              <button className="auth-button" onClick={() => setAuthOpen(true)}>
                <span>LOGIN / REGISTER</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="main-header">
        <div className="container">
          <h1 className="logo">
            <span className="logo-highlight">CAR</span>RENTAL
          </h1>

          <div className="search-user-container">
            <div className={`search-container ${searchFocused ? 'focused' : ''}`}>
              <FaSearch className="search-icon" />
              <input 
                type="text" 
                placeholder="Search for cars..." 
                className="search-bar"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
            </div>

            {/* User Dropdown */}
            <div
              className="user-dropdown"
              ref={dropdownRef}
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button className="user-button">
                <FaUserCircle className="user-icon" />
                <span className="user-name">
                  {loading ? "Loading..." : user ? user.fullName : "Guest"}
                </span>
                <FaChevronDown className={`dropdown-arrow ${dropdownOpen ? 'open' : ''}`} />
              </button>
              
              <div className={`dropdown-menu ${dropdownOpen ? 'open' : ''}`}>
                {!user ? (
                  <button className="dropdown-item login-item" onClick={() => setAuthOpen(true)}>
                    <span>Login / Register</span>
                  </button>
                ) : (
                  <>
                    <Link to="/profile-settings" className="dropdown-item">
                      <span>Profile Settings</span>
                    </Link>
                    <Link to="/update-password" className="dropdown-item">
                      <span>Update Password</span>
                    </Link>
                    <Link to="/my-booking" className="dropdown-item">
                      <span>My Bookings</span>
                    </Link>
                    <Link to="/post-testimonial" className="dropdown-item">
                      <span>Post Testimonial</span>
                    </Link>
                    <Link to="/my-testimonial" className="dropdown-item">
                      <span>My Testimonials</span>
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button onClick={handleLogout} className="dropdown-item logout">
                      <span>Sign Out</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="main-nav">
        <div className="container">
          <div className="nav-links">
            <Link to="/" className="nav-link">HOME</Link>
            <Link to="/about" className="nav-link">ABOUT US</Link>
            <Link to="/car-listing" className="nav-link">CAR LISTING</Link>
            <Link to="/faqs" className="nav-link">FAQS</Link>
            <Link to="/contact" className="nav-link">CONTACT US</Link>
          </div>
        </div>
      </nav>

      <AuthModal isOpen={isAuthOpen} onClose={() => setAuthOpen(false)} />

      {/* CSS */}
      <style jsx>{`
        /* Base Styles */
        .header-container {
          font-family: 'Poppins', sans-serif;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        /* Top Bar */
        .top-bar {
          background-color: #2c3e50;
          color: #fff;
          padding: 8px 0;
          font-size: 13px;
        }
        
        .contact-info {
          display: flex;
          gap: 30px;
        }
        
        .contact-item {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .contact-text {
          display: flex;
          flex-direction: column;
        }
        
        .contact-label {
          font-weight: 600;
          font-size: 11px;
          opacity: 0.8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .contact-value {
          font-size: 12px;
          margin-top: 2px;
        }
        
        .icon {
          font-size: 16px;
        }
        
        .email-icon {
          color: #e74c3c;
        }
        
        .phone-icon {
          color: #2ecc71;
        }
        
        .social-auth {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        
        .social-icons {
          display: flex;
          gap: 15px;
        }
        
        .social-icon {
          color: #bdc3c7;
          font-size: 16px;
          transition: all 0.2s ease;
        }
        
        .social-icon:hover {
          color: #fff;
          transform: translateY(-2px);
        }
        
        .facebook:hover { color: #3b5998; }
        .twitter:hover { color: #1da1f2; }
        .linkedin:hover { color: #0077b5; }
        .instagram:hover { color: #e1306c; }
        
        .auth-button {
          background: linear-gradient(135deg, #3498db, #2980b9);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .auth-button:hover {
          background: linear-gradient(135deg, #2980b9, #3498db);
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        
        /* Main Header */
        .main-header {
          background-color: #fff;
          padding: 20px 0;
          border-bottom: 1px solid #eee;
        }
        
        .logo {
          font-size: 32px;
          font-weight: 700;
          color: #2c3e50;
          margin: 0;
        }
        
        .logo-highlight {
          color: #3498db;
        }
        
        .search-user-container {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        
        .search-container {
          display: flex;
          align-items: center;
          background: #f5f7fa;
          border-radius: 30px;
          padding: 8px 15px;
          transition: all 0.3s ease;
          border: 1px solid #e0e6ed;
        }
        
        .search-container.focused {
          border-color: #3498db;
          box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
          background: #fff;
        }
        
        .search-icon {
          color: #7f8c8d;
          font-size: 16px;
          margin-right: 8px;
        }
        
        .search-bar {
          border: none;
          background: transparent;
          outline: none;
          font-size: 14px;
          width: 200px;
          transition: width 0.3s ease;
        }
        
        .search-container.focused .search-bar {
          width: 250px;
        }
        
        /* User Dropdown */
        .user-dropdown {
          position: relative;
        }
        
        .user-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          color: #2c3e50;
          font-weight: 500;
          cursor: pointer;
          padding: 8px 12px;
          border-radius: 4px;
          transition: all 0.2s ease;
        }
        
        .user-button:hover {
          background: #f5f7fa;
        }
        
        .user-icon {
          font-size: 20px;
          color: #7f8c8d;
        }
        
        .dropdown-arrow {
          font-size: 12px;
          transition: transform 0.2s ease;
        }
        
        .dropdown-arrow.open {
          transform: rotate(180deg);
        }
        
        .dropdown-menu {
          position: absolute;
          right: 0;
          top: 100%;
          background: #fff;
          min-width: 220px;
          border-radius: 8px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
          z-index: 100;
          opacity: 0;
          visibility: hidden;
          transform: translateY(10px);
          transition: all 0.2s ease;
          padding: 8px 0;
        }
        
        .dropdown-menu.open {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }
        
        .dropdown-item {
          display: flex;
          align-items: center;
          padding: 10px 16px;
          color: #34495e;
          text-decoration: none;
          font-size: 14px;
          transition: all 0.2s ease;
        }
        
        .dropdown-item:hover {
          background: #f8f9fa;
          color: #3498db;
        }
        
        .dropdown-item span {
          margin-left: 8px;
        }
        
        .dropdown-divider {
          height: 1px;
          background: #eee;
          margin: 6px 0;
        }
        
        .logout {
          color: #e74c3c;
        }
        
        /* Navigation */
        .main-nav {
          background-color: #3498db;
        }
        
        .nav-links {
          display: flex;
          gap: 2px;
        }
        
        .nav-link {
          color: rgba(255, 255, 255, 0.9);
          text-decoration: none;
          font-weight: 500;
          font-size: 14px;
          padding: 15px 20px;
          transition: all 0.2s ease;
          position: relative;
        }
        
        .nav-link:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.1);
        }
        
        .nav-link:after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 3px;
          background: #fff;
          transition: all 0.3s ease;
          transform: translateX(-50%);
        }
        
        .nav-link:hover:after {
          width: 100%;
        }
        
        /* Responsive Adjustments */
        @media (max-width: 992px) {
          .container {
            flex-direction: column;
            gap: 15px;
          }
          
          .contact-info {
            flex-direction: column;
            gap: 10px;
          }
          
          .search-user-container {
            width: 100%;
            justify-content: space-between;
          }
          
          .nav-links {
            overflow-x: auto;
            padding-bottom: 10px;
          }
        }
        
        @media (max-width: 768px) {
          .top-bar .container {
            flex-direction: column;
            gap: 10px;
          }
          
          .social-auth {
            width: 100%;
            justify-content: space-between;
          }
          
          .search-bar {
            width: 150px;
          }
          
          .search-container.focused .search-bar {
            width: 180px;
          }
        }
      `}</style>
    </header>
  );
}