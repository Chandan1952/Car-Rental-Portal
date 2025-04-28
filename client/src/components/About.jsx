import React from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const About = () => {
  return (
    <div className="about-page">
      <Header />
      
      <main className="about-container">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="hero-content">
            <h1 className="hero-heading">
              <span className="hero-highlight">Drive Your Dreams</span> with Car Rental Portal
            </h1>
            <p className="hero-text">
              Where every journey begins with the perfect ride
            </p>
          </div>
          <div className="hero-image-container">
            <div className="hero-image"></div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="about-section mission-section">
          <div className="section-decoration"></div>
          <h2 className="section-heading">
            <span className="heading-icon">🚀</span>
            Our Mission
          </h2>
          <p className="section-text">
            We're revolutionizing car rentals by making them <span className="highlight-text">easy, affordable, and accessible</span> 
            for everyone. Whether you need a car for business, travel, or leisure, 
            we connect you with the perfect vehicle for your needs.
          </p>
        </section>

        {/* Features Section */}
        <section className="about-section features-section">
          <h2 className="section-heading">
            <span className="heading-icon">✨</span>
            Why Choose Us
          </h2>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚗</div>
              <h3 className="feature-title">Diverse Fleet</h3>
              <p className="feature-text">
                From compact cars to luxury SUVs, we've got vehicles for every need and budget.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3 className="feature-title">Transparent Pricing</h3>
              <p className="feature-text">
                No hidden fees. What you see is what you pay, with competitive rates.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3 className="feature-title">Easy Booking</h3>
              <p className="feature-text">
                Book your perfect ride in minutes with our intuitive platform.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3 className="feature-title">24/7 Support</h3>
              <p className="feature-text">
                Our team is always ready to assist you, anytime, anywhere.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <h2 className="cta-heading">Ready for your next adventure?</h2>
          <Link to="/car-listing" className="cta-button">
            Explore Our Fleet <span className="cta-arrow">→</span>
          </Link>
        </section>
      </main>
      
      <Footer />

      {/* CSS Styles */}
      <style jsx>{`
        .about-page {
          font-family: 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
          color: #2d3748;
          line-height: 1.6;
        }
        
        /* Hero Section */
        .about-hero {
          display: flex;
          flex-direction: column-reverse;
          align-items: center;
          padding: 2rem 1rem;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }
        
        .hero-content {
          text-align: center;
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem 0;
        }
        
        .hero-heading {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
          line-height: 1.2;
          color: #1a202c;
        }
        
        .hero-highlight {
          color: #e53e3e;
          display: block;
        }
        
        .hero-text {
          font-size: 1.25rem;
          color: #4a5568;
          margin-bottom: 2rem;
        }
        
        .hero-image-container {
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
        }
        
        .hero-image {
          height: 300px;
          background-image: url('https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80');
          background-size: cover;
          background-position: center;
          border-radius: 12px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        
        /* Sections */
        .about-section {
          padding: 4rem 1rem;
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
        }
        
        .mission-section {
          background-color: #fff;
          text-align: center;
        }
        
        .section-decoration {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 4px;
          background: linear-gradient(90deg, #e53e3e, #dd6b20);
          border-radius: 2px;
        }
        
        .section-heading {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: #1a202c;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        
        .heading-icon {
          font-size: 1.5em;
        }
        
        .section-text {
          font-size: 1.125rem;
          color: #4a5568;
          max-width: 700px;
          margin: 0 auto;
        }
        
        .highlight-text {
          color: #e53e3e;
          font-weight: 600;
        }
        
        /* Features Section */
        .features-section {
          background-color: #f8f9fa;
        }
        
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-top: 3rem;
        }
        
        .feature-card {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          text-align: center;
        }
        
        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        
        .feature-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }
        
        .feature-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          color: #1a202c;
        }
        
        .feature-text {
          color: #4a5568;
          font-size: 1rem;
        }
        
        /* CTA Section */
        .cta-section {
          text-align: center;
          padding: 4rem 1rem;
          background: linear-gradient(135deg, #e53e3e 0%, #dd6b20 100%);
          color: white;
        }
        
        .cta-heading {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
        }
        
        .cta-button {
          display: inline-flex;
          align-items: center;
          background-color: white;
          color: #e53e3e;
          padding: 1rem 2rem;
          font-size: 1.125rem;
          font-weight: 600;
          border-radius: 8px;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        
        .cta-arrow {
          margin-left: 0.5rem;
          transition: transform 0.3s ease;
        }
        
        .cta-button:hover .cta-arrow {
          transform: translateX(3px);
        }
        
        /* Animations */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .about-container {
          animation: fadeIn 0.6s ease-out;
        }
        
        .feature-card {
          animation: fadeIn 0.6s ease-out;
          animation-fill-mode: both;
        }
        
        .feature-card:nth-child(1) { animation-delay: 0.1s; }
        .feature-card:nth-child(2) { animation-delay: 0.2s; }
        .feature-card:nth-child(3) { animation-delay: 0.3s; }
        .feature-card:nth-child(4) { animation-delay: 0.4s; }
        
        /* Responsive Design */
        @media (min-width: 768px) {
          .about-hero {
            flex-direction: row;
            padding: 4rem 2rem;
            min-height: 500px;
          }
          
          .hero-content {
            text-align: left;
            padding-right: 3rem;
            flex: 1;
          }
          
          .hero-heading {
            font-size: 3rem;
          }
          
          .hero-image-container {
            flex: 1;
          }
          
          .hero-image {
            height: 400px;
          }
        }
        
        @media (max-width: 600px) {
          .hero-heading {
            font-size: 2rem;
          }
          
          .section-heading {
            font-size: 1.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default About;