import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaGoogle, FaPaperPlane } from "react-icons/fa";
import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage("Please enter a valid email.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("https://car-rental-portal-backend.onrender.com/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setMessage(data.message || "Thank you for subscribing!");
      setEmail("");
    } catch (error) {
      setMessage("Failed to subscribe. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.topWave}></div>
      
      <div style={styles.container}>
        {/* Company Info */}
        <div style={styles.section}>
          <h4 style={styles.title}>CAR RENTAL PORTAL</h4>
          <p style={styles.description}>
            Your trusted partner for premium car rental services. We offer the best vehicles at competitive prices.
          </p>
          
          <div style={styles.contactInfo}>
            <div style={styles.contactItem}>
              <MdLocationOn style={styles.contactIcon} />
              <span>123 Auto Street, Vehicle City</span>
            </div>
            <div style={styles.contactItem}>
              <MdPhone style={styles.contactIcon} />
              <span>+1 (555) 123-4567</span>
            </div>
            <div style={styles.contactItem}>
              <MdEmail style={styles.contactIcon} />
              <span>info@carrentalportal.com</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div style={styles.section}>
          <h4 style={styles.title}>QUICK LINKS</h4>
          <ul style={styles.linkList}>
            {[
              { path: "about", name: "About Us" },
              { path: "faqs", name: "FAQs" },
              { path: "privacy", name: "Privacy Policy" },
              { path: "terms", name: "Terms & Conditions" },
              { path: "admin-login", name: "Admin Login" }
            ].map((item, i) => (
              <li key={i} style={styles.linkItem}>
                <Link to={`/${item.path}`} style={styles.link}>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div style={styles.subscribeSection}>
          <h4 style={styles.title}>NEWSLETTER</h4>
          <p style={styles.description}>
            Subscribe to get updates on special offers and discounts.
          </p>
          
          <form onSubmit={handleSubscribe} style={styles.subscribeForm}>
            <div style={styles.inputGroup}>
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                required
              />
              <button 
                type="submit" 
                style={styles.subscribeButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    <FaPaperPlane style={{ marginRight: "8px" }} />
                    Subscribe
                  </>
                )}
              </button>
            </div>
            {message && (
              <p style={message.includes("Thank you") ? styles.successMessage : styles.errorMessage}>
                {message}
              </p>
            )}
          </form>
        </div>
      </div>

      {/* Social & Copyright */}
      <div style={styles.bottomSection}>
        <div style={styles.socialIcons}>
          {[
            { icon: FaFacebook, color: "#4267B2", name: "Facebook" },
            { icon: FaTwitter, color: "#1DA1F2", name: "Twitter" },
            { icon: FaLinkedin, color: "#0077B5", name: "LinkedIn" },
            { icon: FaGoogle, color: "#DB4437", name: "Google" },
            { icon: FaInstagram, color: "#E1306C", name: "Instagram" }
          ].map(({ icon: Icon, color, name }, i) => (
            <a 
              key={i} 
              href={`https://${name.toLowerCase()}.com`} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ ...styles.icon, color }}
              aria-label={name}
            >
              <Icon />
            </a>
          ))}
        </div>

        <p style={styles.copyright}>
          © {new Date().getFullYear()} Car Rental Portal. All rights reserved.
        </p>
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-5px); }
            100% { transform: translateY(0px); }
          }

          .social-icon:hover {
            animation: float 0.5s ease-in-out;
            transform: scale(1.1);
          }

          a:hover {
            color: #4CAF50 !important;
            transform: translateX(3px);
            transition: all 0.3s ease;
          }
        `}
      </style>
    </footer>
  );
};

// Modern CSS-in-JS with improved styling
const styles = {
  footer: {
    backgroundColor: "#1a1a1a",
    color: "#ffffff",
    padding: "80px 20px 30px",
    position: "relative",
    fontFamily: "'Poppins', sans-serif",
    marginTop: "80px",
  },
  topWave: {
    position: "absolute",
    top: "-50px",
    left: 0,
    width: "100%",
    height: "50px",
    background: "url('data:image/svg+xml;utf8,<svg viewBox=\"0 0 1200 120\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z\" fill=\"%231a1a1a\" opacity=\".25\"/><path d=\"M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z\" fill=\"%231a1a1a\" opacity=\".5\"/><path d=\"M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z\" fill=\"%231a1a1a\"/></svg>')",
    backgroundSize: "cover",
  },
  container: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: "40px",
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    paddingBottom: "40px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },
  section: {
    flex: "1 1 250px",
    padding: "0 15px",
  },
  title: {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "20px",
    position: "relative",
    paddingBottom: "10px",
    color: "#4CAF50",
  },
  description: {
    fontSize: "14px",
    lineHeight: "1.6",
    color: "#bbb",
    marginBottom: "20px",
  },
  contactInfo: {
    marginTop: "20px",
  },
  contactItem: {
    display: "flex",
    alignItems: "center",
    marginBottom: "12px",
    fontSize: "14px",
    color: "#ddd",
  },
  contactIcon: {
    marginRight: "10px",
    color: "#4CAF50",
    fontSize: "18px",
  },
  linkList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  linkItem: {
    marginBottom: "12px",
    transition: "transform 0.3s ease",
  },
  link: {
    color: "#ddd",
    textDecoration: "none",
    fontSize: "15px",
    display: "inline-block",
    transition: "all 0.3s ease",
  },
  subscribeSection: {
    flex: "1 1 300px",
    padding: "0 15px",
  },
  subscribeForm: {
    marginTop: "20px",
  },
  inputGroup: {
    display: "flex",
    marginBottom: "10px",
  },
  input: {
    padding: "12px 15px",
    flex: 1,
    borderRadius: "4px 0 0 4px",
    border: "none",
    background: "#333",
    color: "#fff",
    fontSize: "14px",
    outline: "none",
  },
  subscribeButton: {
    backgroundColor: "#4CAF50",
    color: "#fff",
    padding: "0 20px",
    border: "none",
    borderRadius: "0 4px 4px 0",
    cursor: "pointer",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
    minWidth: "120px",
    "&:hover": {
      backgroundColor: "#45a049",
    },
    "&:disabled": {
      backgroundColor: "#666",
      cursor: "not-allowed",
    },
  },
  errorMessage: {
    color: "#ff6b6b",
    fontSize: "14px",
    marginTop: "8px",
  },
  successMessage: {
    color: "#4CAF50",
    fontSize: "14px",
    marginTop: "8px",
  },
  bottomSection: {
    maxWidth: "1200px",
    margin: "30px auto 0",
    textAlign: "center",
  },
  socialIcons: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  icon: {
    fontSize: "22px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "scale(1.2)",
    },
  },
  copyright: {
    fontSize: "14px",
    color: "#aaa",
    marginTop: "20px",
  },
};

export default Footer;
