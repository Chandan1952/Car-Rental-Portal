import React, { useState, useEffect } from "react";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import { FiMapPin, FiMail, FiPhone, FiSave } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateContactInfo = () => {
  const [contactInfo, setContactInfo] = useState({
    address: "",
    email: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchContactDetails = async () => {
      try {
        const response = await fetch("https://car-rental-portal-backend.onrender.com/contact-details");
        const data = await response.json();
        setContactInfo(data);
      } catch (error) {
        toast.error("Failed to fetch contact details");
        console.error("Error fetching contact info:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchContactDetails();
  }, []);

  const handleChange = (e) => {
    setContactInfo({ ...contactInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      const response = await fetch("https://car-rental-portal-backend.onrender.com/update-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactInfo),
      });
      
      if (response.ok) {
        toast.success("Contact information updated successfully!");
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      toast.error("Failed to update contact information");
      console.error("Error updating contact info:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader />
        
        <div className="contact-info-container">
          <div className="contact-info-card">
            <h2 className="contact-info-title">
              Update Contact Information
            </h2>
            <p className="contact-info-subtitle">
              Manage how customers can reach your business
            </p>
            
            {isLoading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Loading contact information...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-info-form">
                <div className="form-group">
                  <label className="form-label">
                    <FiMapPin className="input-icon" />
                    Business Address
                  </label>
                  <textarea
                    name="address"
                    value={contactInfo.address}
                    onChange={handleChange}
                    className="form-input"
                    rows="3"
                    placeholder="Enter your business address"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">
                    <FiMail className="input-icon" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={contactInfo.email}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="contact@example.com"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">
                    <FiPhone className="input-icon" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={contactInfo.phone}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="+1 (123) 456-7890"
                    required
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="submit-button"
                  disabled={isUpdating}
                >
                  <FiSave className="button-icon" />
                  {isUpdating ? "Updating..." : "Update Contact Info"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      
      <ToastContainer position="top-right" autoClose={3000} />
      
      <style jsx>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
          background-color: #f5f7fa;
        }
        
        .admin-main {
          flex: 1;
          margin-left: 260px;
          padding: 20px;
        }
        
        .contact-info-container {
          max-width: 800px;
          margin: 30px auto;
        }
        
        .contact-info-card {
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          padding: 30px;
        }
        
        .contact-info-title {
          font-size: 1.75rem;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 0.5rem;
        }
        
        .contact-info-subtitle {
          color: #718096;
          margin-bottom: 2rem;
          font-size: 0.95rem;
        }
        
        .contact-info-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .form-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.95rem;
          font-weight: 500;
          color: #4a5568;
        }
        
        .input-icon {
          color: #667eea;
        }
        
        .form-input {
          padding: 12px 16px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.95rem;
          transition: all 0.2s ease;
          background-color: #f8fafc;
        }
        
        .form-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          background-color: #fff;
        }
        
        textarea.form-input {
          min-height: 100px;
          resize: vertical;
        }
        
        .submit-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 12px 20px;
          background-color: #667eea;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: 1rem;
        }
        
        .submit-button:hover {
          background-color: #5a67d8;
        }
        
        .submit-button:disabled {
          background-color: #a3bffa;
          cursor: not-allowed;
        }
        
        .button-icon {
          font-size: 1rem;
        }
        
        .loading-spinner {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          gap: 1rem;
        }
        
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(102, 126, 234, 0.2);
          border-radius: 50%;
          border-top-color: #667eea;
          animation: spin 1s ease-in-out infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default UpdateContactInfo;
