import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaLock, FaEnvelope, FaSignInAlt, FaHome } from "react-icons/fa";
import { motion } from "framer-motion";

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/admin-login", formData, { 
        withCredentials: true 
      });

      if (response.status === 200) {
        localStorage.setItem("adminToken", response.data.token);
        localStorage.setItem("adminEmail", formData.email);
        navigate("/admin-dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.error || 
        "Invalid credentials. Please try again.");
      document.getElementById("login-form").classList.add("shake");
      setTimeout(() => {
        document.getElementById("login-form").classList.remove("shake");
      }, 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      {/* Background image with overlay */}
      <div className="background-image"></div>
      <div className="background-overlay"></div>
      
      <motion.div 
        id="login-form"
        className="login-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="logo-container">
          <FaLock className="logo-icon" />
          <h1>Admin Portal</h1>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className="input-group">
            <label htmlFor="email">
              <FaEnvelope className="input-icon" />
              <span>Admin Email</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="admin@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">
              <FaLock className="input-icon" />
              <span>Password</span>
            </label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button 
                type="button" 
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <path fill="currentColor" d="M12 9a3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3m0-4.5c5 0 9.27 3.11 11 7.5-1.73 4.39-6 7.5-11 7.5S2.73 16.39 1 12c1.73-4.39 6-7.5 11-7.5M3.18 12a9.821 9.821 0 0 0 17.64 0 9.821 9.821 0 0 0-17.64 0z"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <path fill="currentColor" d="M11.83 9L15 12.16V12a3 3 0 0 0-3-3h-.17m-4.3.8l1.55 1.55c-.05.21-.08.42-.08.65a3 3 0 0 0 3 3c.22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53a5 5 0 0 1-5-5c0-.79.2-1.53.53-2.2M2 4.27l2.28 2.28.45.45C3.08 8.3 1.78 10 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.43.42L19.73 22 21 20.73 3.27 3M12 7a5 5 0 0 1 5 5c0 .64-.13 1.26-.36 1.82l2.93 2.93c1.5-1.25 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-4 .7l2.17 2.15C10.74 7.13 11.35 7 12 7z"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="options-row">
            <label className="remember-me">
              <input type="checkbox" />
              <span className="checkmark"></span>
              Remember me
            </label>
            <Link to="/forgot-password" className="forgot-password">
              Forgot password?
            </Link>
          </div>

          <motion.button
            type="submit"
            className="login-button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
          >
            {loading ? (
              <div className="spinner"></div>
            ) : (
              <>
                <FaSignInAlt className="button-icon" />
                Sign In
              </>
            )}
          </motion.button>

          <div className="back-home">
            <Link to="/">
              <FaHome className="home-icon" />
              Back to Home
            </Link>
          </div>
        </form>
      </motion.div>

      <style jsx>{`
        .admin-login-container {
          position: relative;
          width: 100%;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
        }
        
        .background-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80');
          background-size: cover;
          background-position: center;
          z-index: 1;
        }
        
        .background-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.6);
          z-index: 2;
        }
        
        .login-card {
          position: relative;
          z-index: 3;
          background: white;
          border-radius: 16px;
          padding: 40px;
          width: 100%;
          max-width: 450px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }
        
        .login-card.shake {
          animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .logo-container {
          text-align: center;
          margin-bottom: 30px;
        }
        
        .logo-icon {
          font-size: 40px;
          color: #d9534f;
          margin-bottom: 10px;
        }
        
        .logo-container h1 {
          margin: 0;
          color: #333;
          font-size: 24px;
          font-weight: 600;
        }
        
        .login-form {
          display: flex;
          flex-direction: column;
        }
        
        .error-message {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          background-color: #fee2e2;
          color: #dc2626;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 14px;
        }
        
        .input-group {
          margin-bottom: 20px;
        }
        
        .input-group label {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          color: #555;
          font-size: 14px;
          font-weight: 500;
        }
        
        .input-icon {
          color: #777;
        }
        
        .input-group input {
          width: 100%;
          padding: 14px 16px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 15px;
          transition: all 0.3s ease;
        }
        
        .input-group input:focus {
          outline: none;
          border-color: #d9534f;
          box-shadow: 0 0 0 3px rgba(217, 83, 79, 0.2);
        }
        
        .password-wrapper {
          position: relative;
        }
        
        .toggle-password {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #777;
          cursor: pointer;
          padding: 4px;
        }
        
        .options-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 15px 0 25px;
        }
        
        .remember-me {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #555;
          cursor: pointer;
        }
        
        .remember-me input {
          position: absolute;
          opacity: 0;
          cursor: pointer;
        }
        
        .checkmark {
          height: 16px;
          width: 16px;
          background-color: white;
          border: 1px solid #ccc;
          border-radius: 3px;
          transition: all 0.2s ease;
        }
        
        .remember-me:hover input ~ .checkmark {
          border-color: #999;
        }
        
        .remember-me input:checked ~ .checkmark {
          background-color: #d9534f;
          border-color: #d9534f;
        }
        
        .checkmark:after {
          content: "";
          position: absolute;
          display: none;
        }
        
        .remember-me input:checked ~ .checkmark:after {
          display: block;
        }
        
        .remember-me .checkmark:after {
          left: 5px;
          top: 2px;
          width: 4px;
          height: 8px;
          border: solid white;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }
        
        .forgot-password {
          color: #d9534f;
          font-size: 14px;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        
        .forgot-password:hover {
          text-decoration: underline;
        }
        
        .login-button {
          width: 100%;
          padding: 14px;
          background-color: #d9534f;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
        }
        
        .login-button:hover {
          background-color: #c9302c;
        }
        
        .login-button:disabled {
          background-color: #e6a5a3;
          cursor: not-allowed;
        }
        
        .button-icon {
          font-size: 16px;
        }
        
        .spinner {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .back-home {
          text-align: center;
          margin-top: 20px;
        }
        
        .back-home a {
          color: #555;
          text-decoration: none;
          font-size: 14px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: color 0.2s ease;
        }
        
        .back-home a:hover {
          color: #d9534f;
        }
        
        .home-icon {
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;