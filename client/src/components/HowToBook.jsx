import React, { useState, useEffect } from "react";
import { FaCar, FaCheckCircle } from "react-icons/fa";
import { MdOutlineDateRange, MdDirectionsCar, MdVerifiedUser, MdPayment } from "react-icons/md";
import { IoMdTime } from "react-icons/io";
import { RiCustomerService2Fill } from "react-icons/ri";

const BookingPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hoveredStep, setHoveredStep] = useState(null);

  useEffect(() => {
    setIsVisible(true);
    
    // Animate car through steps
    const timer = setInterval(() => {
      setCurrentStep(prev => (prev < 3 ? prev + 1 : 0));
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  // Calculate car position based on current step
  const getCarPosition = () => {
    return `${12 + currentStep * 25}%`;
  };

  // Animation styles
  const fadeIn = {
    opacity: isVisible ? 1 : 0,
    transition: 'opacity 0.8s ease-in-out'
  };

  const slideUp = {
    transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
    opacity: isVisible ? 1 : 0,
    transition: 'all 0.8s cubic-bezier(0.22, 1, 0.36, 1)'
  };

  const pulse = {
    animation: isVisible ? 'pulse 2.5s infinite' : 'none'
  };

  // Keyframes for animations
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      @keyframes pulse {
        0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(52, 152, 219, 0.4); }
        70% { transform: scale(1.02); box-shadow: 0 0 0 12px rgba(52, 152, 219, 0); }
        100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(52, 152, 219, 0); }
      }
      @keyframes bounce {
        0%, 100% { transform: translateY(0) translateX(-50%); }
        50% { transform: translateY(-8px) translateX(-50%); }
      }
      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
      }
    `;
    document.head.appendChild(styleElement);
    return () => document.head.removeChild(styleElement);
  }, []);

  // Main container styles
  const containerStyle = {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "40px 20px",
    fontFamily: "'Poppins', sans-serif",
    color: "#2d3436",
    background: "linear-gradient(to bottom, #f9f9f9, #ffffff)",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
    ...fadeIn
  };

  // Header styles
  const headerStyle = {
    textAlign: "center",
    marginBottom: "60px",
    ...fadeIn
  };

  const titleStyle = {
    fontSize: "2.5rem",
    color: "#2c3e50",
    marginBottom: "20px",
    fontWeight: "700",
    background: "linear-gradient(45deg, #3498db, #2ecc71)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    ...slideUp,
    transitionDelay: '0.1s'
  };

  const subtitleStyle = {
    fontSize: "1.1rem",
    lineHeight: "1.6",
    marginBottom: "30px",
    color: "#636e72",
    maxWidth: "700px",
    marginLeft: "auto",
    marginRight: "auto",
    ...slideUp,
    transitionDelay: '0.2s'
  };

  const ctaButtonStyle = {
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    padding: "16px 32px",
    fontSize: "1rem",
    borderRadius: "50px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontWeight: "600",
    boxShadow: "0 4px 15px rgba(52, 152, 219, 0.3)",
    ...slideUp,
    transitionDelay: '0.3s',
    ...pulse,
    display: "inline-flex",
    alignItems: "center",
    gap: "10px"
  };

  // Steps container styles
  const stepsContainerStyle = {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "60px",
    position: "relative",
    ...fadeIn,
    transitionDelay: '0.4s'
  };

  const stepsLineStyle = {
    position: "absolute",
    top: "50px",
    left: "10%",
    right: "10%",
    height: "4px",
    background: "linear-gradient(90deg, #3498db, #2ecc71)",
    zIndex: "1",
    transform: isVisible ? 'scaleX(1)' : 'scaleX(0)',
    transformOrigin: 'left center',
    transition: 'transform 1s cubic-bezier(0.22, 1, 0.36, 1)',
    transitionDelay: '0.5s',
    borderRadius: "4px"
  };

  // Car icon styles
  const carStyle = {
    position: "absolute",
    top: "30px",
    left: getCarPosition(),
    zIndex: "3",
    fontSize: "32px",
    transform: "translateX(-50%)",
    transition: "left 1s cubic-bezier(0.22, 1, 0.36, 1)",
    animation: "bounce 1.5s infinite",
    color: "#e74c3c",
    filter: "drop-shadow(0 4px 8px rgba(231, 76, 60, 0.3))"
  };

  // Individual step styles
  const stepStyle = (delay, index) => ({
    textAlign: "center",
    width: "22%",
    position: "relative",
    zIndex: "2",
    ...slideUp,
    transitionDelay: `${0.6 + delay * 0.1}s`,
    cursor: "pointer",
    transform: hoveredStep === index ? 'translateY(-10px)' : 'translateY(0)',
    transition: 'transform 0.3s ease'
  });

  const stepIconContainerStyle = (index) => ({
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    backgroundColor: currentStep >= index ? "#2ecc71" : "#3498db",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
    boxShadow: currentStep >= index ? 
      "0 8px 20px rgba(46, 204, 113, 0.3)" : 
      "0 8px 20px rgba(52, 152, 219, 0.3)",
    transition: "all 0.4s ease",
    position: "relative",
    overflow: "hidden",
    "::before": {
      content: '""',
      position: "absolute",
      top: "-50%",
      left: "-50%",
      right: "-50%",
      bottom: "-50%",
      background: "linear-gradient(45deg, transparent, rgba(255,255,255,0.3), transparent)",
      transform: "rotate(45deg)",
      animation: "shine 3s infinite"
    }
  });

  const stepIconStyle = {
    fontSize: "32px",
    color: "white"
  };

  const stepTitleStyle = {
    fontSize: "1rem",
    fontWeight: "600",
    marginBottom: "8px",
    color: "#2c3e50"
  };

  const stepDescriptionStyle = {
    fontSize: "0.9rem",
    color: "#636e72",
    lineHeight: "1.5"
  };

  // Features section
  const featuresContainerStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "30px",
    marginTop: "60px",
    ...fadeIn,
    transitionDelay: '0.8s'
  };

  const featureCardStyle = {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "25px",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)",
    transition: "all 0.3s ease",
    ":hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)"
    }
  };

  const featureIconStyle = {
    fontSize: "2.5rem",
    color: "#3498db",
    marginBottom: "20px"
  };

  const featureTitleStyle = {
    fontSize: "1.2rem",
    fontWeight: "600",
    marginBottom: "15px",
    color: "#2c3e50"
  };

  const featureTextStyle = {
    fontSize: "0.95rem",
    color: "#636e72",
    lineHeight: "1.6"
  };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <h1 style={titleStyle}>Book Your Perfect Ride in India</h1>
        <p style={subtitleStyle}>
          Experience the freedom of exploring India at your own pace with our premium self-drive car rentals. 
          Choose from a wide selection of vehicles, enjoy unlimited kilometers, and create unforgettable 
          memories on your terms.
        </p>
        <button 
          style={ctaButtonStyle}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#2980b9";
            e.target.style.transform = "scale(1.03)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#3498db";
            e.target.style.transform = "scale(1)";
          }}
        >
          <FaCar /> Book Your Car Now
        </button>
      </header>

      <div style={stepsContainerStyle}>
        <div style={stepsLineStyle}></div>
        <div style={carStyle}><FaCar /></div>
        
        {[
          { icon: <MdOutlineDateRange style={stepIconStyle} />, title: "Select Dates", desc: "Pick your travel dates and location" },
          { icon: <MdDirectionsCar style={stepIconStyle} />, title: "Choose Car", desc: "Select from our premium fleet" },
          { icon: <MdVerifiedUser style={stepIconStyle} />, title: "Verify", desc: "Quick verification process" },
          { icon: <MdPayment style={stepIconStyle} />, title: "Payment", desc: "Secure and easy payment" }
        ].map((step, index) => (
          <div 
            key={index}
            style={stepStyle(0.1 * index, index)}
            onMouseEnter={() => setHoveredStep(index)}
            onMouseLeave={() => setHoveredStep(null)}
          >
            <div style={stepIconContainerStyle(index)}>
              {currentStep > index ? <FaCheckCircle style={stepIconStyle} /> : step.icon}
            </div>
            <h3 style={stepTitleStyle}>{step.title}</h3>
            <p style={stepDescriptionStyle}>{step.desc}</p>
          </div>
        ))}
      </div>

      <div style={featuresContainerStyle}>
        <div style={featureCardStyle}>
          <div style={featureIconStyle}><IoMdTime /></div>
          <h3 style={featureTitleStyle}>24/7 Availability</h3>
          <p style={featureTextStyle}>
            Book your car anytime, anywhere with our 24/7 online platform and customer support.
          </p>
        </div>
        
        <div style={featureCardStyle}>
          <div style={featureIconStyle}><RiCustomerService2Fill /></div>
          <h3 style={featureTitleStyle}>Premium Support</h3>
          <p style={featureTextStyle}>
            Our dedicated support team is always ready to assist you throughout your journey.
          </p>
        </div>
        
        <div style={featureCardStyle}>
          <div style={featureIconStyle}><MdVerifiedUser /></div>
          <h3 style={featureTitleStyle}>Verified Vehicles</h3>
          <p style={featureTextStyle}>
            All our vehicles undergo rigorous checks to ensure your safety and comfort.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;