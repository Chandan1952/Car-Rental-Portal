import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { FiMail, FiPhone, FiMapPin, FiSend, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

const ContactUs = () => {
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    message: "" 
  });
  const [contactDetails, setContactDetails] = useState({ 
    email: "contact@carrental.com", 
    phone: "+1 (555) 123-4567", 
    address: "123 Rental Drive, Auto City, CA 90210" 
  });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      setContactDetails({
        email: "contact@carrental.com",
        phone: "+1 (555) 123-4567",
        address: "123 Rental Drive, Auto City, CA 90210"
      });
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    if (!formData.name || !formData.email || !formData.message) {
      setIsError(true);
      setMessage("All fields are required");
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsError(false);
      setMessage(`Thank you, ${formData.name}! Your message has been sent.`);
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      setIsError(true);
      setMessage("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <Header />
      
      <main className="contact-container">
        {/* Hero Section */}
        <section className="contact-hero">
          <div className="hero-content">
            <h1 className="hero-title">Get in Touch</h1>
            <p className="hero-subtitle">We're here to help with any questions about your rental</p>
          </div>
        </section>

        {/* Contact Content */}
        <div className="contact-content">
          {/* Contact Form */}
          <section className="contact-form-section">
            <h2 className="section-title">
              <span className="title-decoration"></span>
              Send Us a Message
            </h2>
            
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  className="form-textarea"
                  rows="5"
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="button-loader"></span>
                ) : (
                  <>
                    <FiSend className="button-icon" />
                    Send Message
                  </>
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
            </form>
          </section>

          {/* Contact Info */}
          <section className="contact-info-section">
            <h2 className="section-title">
              <span className="title-decoration"></span>
              Contact Information
            </h2>
            
            <div className="contact-info-card">
              <div className="contact-method">
                <div className="contact-icon email">
                  <FiMail />
                </div>
                <div className="contact-details">
                  <h3>Email Us</h3>
                  <p>{contactDetails.email}</p>
                </div>
              </div>
              
              <div className="contact-method">
                <div className="contact-icon phone">
                  <FiPhone />
                </div>
                <div className="contact-details">
                  <h3>Call Us</h3>
                  <p>{contactDetails.phone}</p>
                </div>
              </div>
              
              <div className="contact-method">
                <div className="contact-icon address">
                  <FiMapPin />
                </div>
                <div className="contact-details">
                  <h3>Visit Us</h3>
                  <p>{contactDetails.address}</p>
                </div>
              </div>
            </div>
            
            <div className="map-container">
              <iframe
                title="Car Rental Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215573291234!2d-73.9878449241643!3d40.74844047138986!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1689876543210"
                className="contact-map"
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />

      {/* CSS Styles */}
      <style jsx>{`
        .contact-page {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          color: #2d3748;
          line-height: 1.6;
        }
        
        /* Hero Section */
        .contact-hero {
          background: linear-gradient(135deg, #e53e3e 0%, #dd6b20 100%);
          color: white;
          padding: 5rem 1rem;
          text-align: center;
        }
        
        .hero-title {
          font-size: 3rem;
          font-weight: 800;
          margin-bottom: 1rem;
        }
        
        .hero-subtitle {
          font-size: 1.25rem;
          max-width: 600px;
          margin: 0 auto;
          opacity: 0.9;
        }
        
        /* Main Content */
        .contact-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }
        
        .contact-content {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
          padding: 3rem 0;
        }
        
        @media (min-width: 992px) {
          .contact-content {
            grid-template-columns: 1fr 1fr;
          }
        }
        
        /* Section Styling */
        .section-title {
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 2rem;
          position: relative;
          display: inline-block;
        }
        
        .title-decoration {
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 50px;
          height: 4px;
          background: linear-gradient(90deg, #e53e3e, #dd6b20);
          border-radius: 2px;
        }
        
        /* Contact Form */
        .contact-form {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-group label {
          display: block;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #4a5568;
        }
        
        .form-input, .form-textarea {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.2s ease;
        }
        
        .form-input:focus, .form-textarea:focus {
          outline: none;
          border-color: #e53e3e;
          box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.1);
        }
        
        .form-textarea {
          min-height: 150px;
          resize: vertical;
        }
        
        /* Submit Button */
        .submit-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, #e53e3e 0%, #dd6b20 100%);
          color: white;
          padding: 0.875rem 2rem;
          font-size: 1rem;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
        }
        
        .submit-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(229, 62, 62, 0.2);
        }
        
        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .button-icon {
          font-size: 1.2rem;
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
        
        /* Message Alert */
        .message-alert {
          padding: 1rem;
          border-radius: 8px;
          margin-top: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
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
        
        /* Contact Info Section */
        .contact-info-card {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }
        
        .contact-method {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        
        .contact-method:last-child {
          margin-bottom: 0;
        }
        
        .contact-icon {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          flex-shrink: 0;
        }
        
        .contact-icon.email {
          background-color: #ebf8ff;
          color: #3182ce;
        }
        
        .contact-icon.phone {
          background-color: #ebf4ff;
          color: #5c6ac4;
        }
        
        .contact-icon.address {
          background-color: #f0fff4;
          color: #38a169;
        }
        
        .contact-details h3 {
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
          color: #1a202c;
        }
        
        .contact-details p {
          color: #4a5568;
        }
        
        /* Map */
        .map-container {
          margin-top: 2rem;
        }
        
        .contact-map {
          width: 100%;
          height: 300px;
          border: none;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        /* Responsive Adjustments */
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.25rem;
          }
          
          .hero-subtitle {
            font-size: 1.1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ContactUs;