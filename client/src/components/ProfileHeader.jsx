import React from "react";
import { Link, useLocation } from "react-router-dom";

const styles = {
  container: {
    background: "linear-gradient(135deg, #1F2937 0%, #111827 100%)",
    color: "white",
    textAlign: "center",
    padding: "3rem 1rem",
    position: "relative",
    overflow: "hidden",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  heading: {
    fontSize: "2.25rem",
    fontWeight: "700",
    marginBottom: "0.75rem",
    position: "relative",
    zIndex: 2,
    letterSpacing: "0.025em",
  },
  breadcrumb: {
    fontSize: "1rem",
    color: "#E5E7EB",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    position: "relative",
    zIndex: 2,
  },
  link: {
    color: "#93C5FD",
    textDecoration: "none",
    transition: "all 0.3s ease",
    fontWeight: "500",
    display: "inline-flex",
    alignItems: "center",
    gap: "0.25rem",
  },
  separator: {
    color: "#9CA3AF",
    fontSize: "1.2rem",
  },
  decoration: {
    position: "absolute",
    top: "-50px",
    right: "-50px",
    width: "200px",
    height: "200px",
    borderRadius: "50%",
    background: "rgba(59, 130, 246, 0.1)",
    filter: "blur(40px)",
  },
  decoration2: {
    position: "absolute",
    bottom: "-30px",
    left: "-30px",
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    background: "rgba(167, 139, 250, 0.1)",
    filter: "blur(30px)",
  },
};

const ProfileHeader = () => {
  const location = useLocation();

  const pageTitles = {
    "/profile-settings": "Profile Settings",
    "/update-password": "Update Password",
    "/my-booking": "My Bookings",
    "/post-testimonial": "Share Your Experience",
    "/my-testimonial": "My Testimonials",
  };

  const pageTitle = pageTitles[location.pathname] || "Your Profile";

  return (
    <div style={styles.container}>
      {/* Decorative elements */}
      <div style={styles.decoration}></div>
      <div style={styles.decoration2}></div>
      
      <h1 style={styles.heading}>{pageTitle}</h1>
      <div style={styles.breadcrumb}>
        <Link to="/user-dashboard" style={styles.link}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
            style={{ width: "1rem", height: "1rem" }}
          >
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          Dashboard
        </Link>
        <span style={styles.separator}>/</span>
        <span>{pageTitle}</span>
      </div>

      {/* Hover Effect for Link */}
      <style>
        {`
          a:hover {
            color: #3B82F6;
            text-decoration: underline;
            transform: translateY(-1px);
          }
        `}
      </style>
    </div>
  );
};

export default ProfileHeader;