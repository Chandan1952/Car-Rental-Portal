import React, { useState } from "react";
import Header from "./Header";
import ProfileHeader from "./ProfileHeader";
import Footer from "./Footer";
import UserSidebar from "../components/UserSidebar";
import { FiEdit3, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

const UserPostTestimonial = () => {
  const [testimonial, setTestimonial] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);

  const handleSubmit = async () => {
    if (!testimonial.trim()) {
      setMessage("Please write your testimonial before submitting");
      setIsError(true);
      return;
    }

    if (testimonial.length < 30) {
      setMessage("Testimonial should be at least 30 characters");
      setIsError(true);
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setMessage("Thank you! Your testimonial has been submitted successfully");
      setTestimonial("");
      setCharacterCount(0);
      setIsError(false);
    } catch (error) {
      setMessage("Failed to submit testimonial. Please try again later");
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTextChange = (e) => {
    const text = e.target.value;
    setTestimonial(text);
    setCharacterCount(text.length);
  };

  return (
    <div className="testimonial-page">
      <Header />
      <ProfileHeader />
      
      <div className="testimonial-container">
        <UserSidebar />
        
        <main className="testimonial-content">
          <div className="testimonial-card">
            <div className="card-header">
              <FiEdit3 className="header-icon" />
              <h2>Share Your Experience</h2>
              <p>Your feedback helps us improve our services</p>
            </div>
            
            <div className="form-group">
              <label htmlFor="testimonial">Your Testimonial</label>
              <textarea
                id="testimonial"
                placeholder="Tell us about your experience with our car rental service..."
                value={testimonial}
                onChange={handleTextChange}
                maxLength="500"
                className="testimonial-input"
              />
              <div className={`character-counter ${characterCount > 400 ? 'warning' : ''}`}>
                {characterCount}/500 characters
              </div>
            </div>
            
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
            >
              {isSubmitting ? (
                <span className="button-loader"></span>
              ) : (
                "Submit Testimonial"
              )}
            </button>
            
            {message && (
              <div className={`message-alert ${isError ? 'error' : 'success'}`}>
                {isError ? (
                  <FiAlertCircle className="alert-icon" />
                ) : (
                  <FiCheckCircle className="alert-icon" />
                )}
                {message}
              </div>
            )}
            
            <div className="testimonial-tips">
              <h4>Writing a great testimonial:</h4>
              <ul>
                <li>Describe your overall experience</li>
                <li>Mention specific features you liked</li>
                <li>Keep it honest and authentic</li>
                <li>Aim for 30-500 characters</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
      
      <Footer />

      {/* CSS Styles */}
      <style jsx>{`
        .testimonial-page {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background-color: #f8f9fa;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        
        .testimonial-container {
          display: flex;
          max-width: 1200px;
          margin: 24px auto;
          padding: 0 16px;
          gap: 24px;
          width: 100%;
        }
        
        .testimonial-content {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        
        .testimonial-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          padding: 32px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .testimonial-card:hover {
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.1);
        }
        
        .card-header {
          text-align: center;
          margin-bottom: 32px;
        }
        
        .card-header h2 {
          font-size: 1.75rem;
          font-weight: 700;
          color: #2d3748;
          margin: 12px 0 8px;
        }
        
        .card-header p {
          color: #718096;
          font-size: 1rem;
        }
        
        .header-icon {
          font-size: 2.5rem;
          color: #e53e3e;
          background: rgba(229, 62, 62, 0.1);
          padding: 12px;
          border-radius: 50%;
        }
        
        .form-group {
          margin-bottom: 24px;
        }
        
        .form-group label {
          display: block;
          font-weight: 600;
          margin-bottom: 8px;
          color: #4a5568;
        }
        
        .testimonial-input {
          width: 100%;
          padding: 16px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-family: inherit;
          font-size: 1rem;
          min-height: 180px;
          resize: vertical;
          transition: all 0.2s ease;
        }
        
        .testimonial-input:focus {
          outline: none;
          border-color: #e53e3e;
          box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.1);
        }
        
        .character-counter {
          text-align: right;
          font-size: 0.875rem;
          color: #718096;
          margin-top: 4px;
        }
        
        .character-counter.warning {
          color: #e53e3e;
        }
        
        .submit-button {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #e53e3e 0%, #dd6b20 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        
        .submit-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(229, 62, 62, 0.2);
        }
        
        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .submit-button.submitting {
          background: linear-gradient(135deg, #e53e3e 0%, #dd6b20 100%);
        }
        
        .button-loader {
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
        
        .message-alert {
          padding: 16px;
          border-radius: 8px;
          margin: 16px 0;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
        }
        
        .message-alert.success {
          background-color: #f0fff4;
          color: #2f855a;
        }
        
        .message-alert.error {
          background-color: #fff5f5;
          color: #c53030;
        }
        
        .alert-icon {
          font-size: 1.2rem;
        }
        
        .testimonial-tips {
          margin-top: 32px;
          padding: 16px;
          background-color: #f8f9fa;
          border-radius: 8px;
          border-left: 4px solid #e53e3e;
        }
        
        .testimonial-tips h4 {
          color: #2d3748;
          margin-bottom: 8px;
          font-size: 1.125rem;
        }
        
        .testimonial-tips ul {
          padding-left: 20px;
          color: #4a5568;
          line-height: 1.6;
        }
        
        .testimonial-tips li {
          margin-bottom: 6px;
        }
        
        @media (max-width: 768px) {
          .testimonial-container {
            flex-direction: column;
            padding: 0 12px;
          }
          
          .testimonial-card {
            padding: 24px;
          }
          
          .card-header h2 {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default UserPostTestimonial;