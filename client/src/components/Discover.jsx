import React, { useState } from "react";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  @keyframes fadeInRight {
    from { opacity: 0; transform: translateX(40px); }
    to { opacity: 1; transform: translateX(0); }
  }

  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }

  @media (max-width: 768px) {
    .hero-overlay {
      max-width: 100% !important;
      text-align: center !important;
      margin-right: 0 !important;
      padding: 25px !important;
    }
  }
`;

const HeroSection = ({ title, subtitle }) => {
  const [hover, setHover] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const styles = {
    heroSection: {
      backgroundImage: `
        linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%),
        url('https://images.unsplash.com/photo-1494976388531-d1058494cdd8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')
      `,
      height: "100vh",
      minHeight: "600px",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: "40px",
      boxSizing: "border-box",
      fontFamily: "'Poppins', sans-serif",
      position: "relative",
      overflow: "hidden",
      transition: "background-image 0.5s ease",
    },
    overlay: {
      padding: "40px 50px",
      borderRadius: "20px",
      maxWidth: "550px",
      marginRight: "10%",
      backdropFilter: "blur(10px)",
      backgroundColor: "rgba(255, 255, 255, 0.08)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      color: "white",
      textAlign: "right",
      animation: "fadeInRight 1s ease-in-out",
      boxShadow: "0 15px 35px rgba(0, 0, 0, 0.2)",
      transform: loaded ? "translateY(0)" : "translateY(20px)",
      opacity: loaded ? 1 : 0,
      transition: "all 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
      zIndex: 2,
    },
    title: {
      fontSize: "clamp(2rem, 5vw, 3.5rem)",
      fontWeight: "700",
      marginBottom: "20px",
      lineHeight: "1.2",
      textShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
      background: "linear-gradient(90deg, #fff, #e6e6e6)",
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
    },
    subtitle: {
      fontSize: "clamp(1rem, 2vw, 1.25rem)",
      fontWeight: "300",
      lineHeight: "1.6",
      marginBottom: "30px",
      textShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
    },
    ctaButton: {
      marginTop: "10px",
      padding: "15px 35px",
      fontSize: "1rem",
      fontWeight: "600",
      color: "#fff",
      background: "linear-gradient(135deg, #ff4b2b, #ff416c)",
      border: "none",
      borderRadius: "50px",
      cursor: "pointer",
      transition: "all 0.3s ease, transform 0.2s ease",
      boxShadow: "0 4px 15px rgba(255, 75, 43, 0.4)",
      position: "relative",
      overflow: "hidden",
      zIndex: 1,
    },
    ctaButtonHover: {
      transform: "translateY(-3px)",
      boxShadow: "0 7px 20px rgba(255, 75, 43, 0.6)",
    },
    ctaButtonBefore: {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "linear-gradient(135deg, #ff416c, #ff4b2b)",
      zIndex: -1,
      transition: "opacity 0.3s ease",
      opacity: 0,
    },
    ctaButtonBeforeHover: {
      opacity: 1,
    },
    floatingElements: {
      position: "absolute",
      width: "100%",
      height: "100%",
      top: 0,
      left: 0,
      overflow: "hidden",
      zIndex: 1,
    },
    floatingElement: {
      position: "absolute",
      borderRadius: "50%",
      background: "rgba(255,255,255,0.1)",
      animation: "float 6s infinite ease-in-out",
    },
  };

  // Generate floating elements
  const floatingElements = Array.from({ length: 10 }).map((_, i) => {
    const size = Math.random() * 20 + 10;
    return {
      width: `${size}px`,
      height: `${size}px`,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
    };
  });

  React.useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <>
      <GlobalStyle />
      <div style={styles.heroSection}>
        <div style={styles.floatingElements}>
          {floatingElements.map((el, i) => (
            <div
              key={i}
              style={{ ...styles.floatingElement, ...el }}
            />
          ))}
        </div>
        
        <div 
          className="hero-overlay" 
          style={styles.overlay}
          onLoad={() => setLoaded(true)}
        >
          <h1 style={styles.title}>{title}</h1>
          <p style={styles.subtitle}>{subtitle}</p>
          <button
            style={{
              ...styles.ctaButton,
              ...(hover && styles.ctaButtonHover),
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <span style={{
              ...styles.ctaButtonBefore,
              ...(hover && styles.ctaButtonBeforeHover),
            }} />
            Browse Cars
          </button>
        </div>
      </div>
    </>
  );
};

const Discover = () => {
  return (
    <div>
      <HeroSection
        title="Find Your Perfect Ride"
        subtitle="Discover thousands of premium vehicles, meticulously maintained and ready for your next journey."
      />
    </div>
  );
};

export default Discover;