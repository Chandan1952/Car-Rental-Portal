import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiLogOut, FiUser, FiSettings, FiChevronDown, FiChevronUp } from "react-icons/fi";

const AdminHeader = () => {
  const [admin, setAdmin] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch admin details
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await axios.get("https://car-rental-portal-backend.onrender.com/api/admin", { 
          withCredentials: true 
        });
        setAdmin(response.data);
      } catch (error) {
        console.error("Error fetching admin details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAdminData();
  }, []);

  // Logout function
  const handleLogout = async () => {
    try {
      await axios.post(
        "https://car-rental-portal-backend.onrender.com/admin-logout", 
        {}, 
        { withCredentials: true }
      );
      navigate("/admin-login");
    } catch (error) {
      console.error("Error during logout:", error);
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <>
      {/* Fixed Header */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={styles.logo}>CAR RENTAL</span>
          <span style={styles.adminText}>Admin Portal</span>
        </div>
        
        <div style={styles.headerRight}>
          {!isLoading && (
            <div 
              style={styles.profileDropdown}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <div style={styles.profileInfo}>
                <div style={styles.avatar}>
                  {admin?.name?.charAt(0).toUpperCase() || "A"}
                </div>
                <span style={styles.adminName}>
                  {admin?.name || "Admin"}
                </span>
                {dropdownOpen ? <FiChevronUp /> : <FiChevronDown />}
              </div>
              
              {dropdownOpen && (
                <div style={styles.dropdownMenu}>
                  <div style={styles.dropdownHeader}>
                    <div style={styles.largeAvatar}>
                      {admin?.name?.charAt(0).toUpperCase() || "A"}
                    </div>
                    <div>
                      <h4 style={styles.dropdownName}>{admin?.name || "Admin User"}</h4>
                      <p style={styles.dropdownEmail}>{admin?.email || "admin@example.com"}</p>
                    </div>
                  </div>
                  
                  <div style={styles.menuDivider}></div>
                  
                  <button style={styles.menuItem}>
                    <FiUser style={styles.menuIcon} />
                    My Profile
                  </button>
                  
                  <button style={styles.menuItem}>
                    <FiSettings style={styles.menuIcon} />
                    Settings
                  </button>
                  
                  <div style={styles.menuDivider}></div>
                  
                  <button 
                    onClick={handleLogout}
                    style={{ ...styles.menuItem, color: "#ef4444" }}
                  >
                    <FiLogOut style={styles.menuIcon} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Spacer to prevent content overlap */}
      <div style={{ height: "72px" }}></div>
    </>
  );
};

const styles = {
  header: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    color: "#1f2937",
    padding: "0 24px",
    height: "72px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
    zIndex: 1000,
    borderBottom: "1px solid #e5e7eb",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  logo: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#4f46e5",
    letterSpacing: "0.5px",
  },
  adminText: {
    fontSize: "14px",
    color: "#6b7280",
    fontWeight: "500",
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
  },
  profileDropdown: {
    position: "relative",
    cursor: "pointer",
    userSelect: "none",
  },
  profileInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "8px 12px",
    borderRadius: "8px",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "#f9fafb",
    },
  },
  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    backgroundColor: "#4f46e5",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600",
    fontSize: "14px",
  },
  adminName: {
    fontSize: "14px",
    fontWeight: "500",
  },
  dropdownMenu: {
    position: "absolute",
    right: 0,
    top: "calc(100% + 8px)",
    width: "280px",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.12)",
    padding: "12px 0",
    zIndex: 1001,
    animation: "fadeIn 0.2s ease-out",
  },
  dropdownHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "0 16px 12px",
  },
  largeAvatar: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    backgroundColor: "#4f46e5",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600",
    fontSize: "18px",
    flexShrink: 0,
  },
  dropdownName: {
    margin: 0,
    fontSize: "15px",
    fontWeight: "600",
    color: "#1f2937",
    textAlign: "left",
  },
  dropdownEmail: {
    margin: "4px 0 0",
    fontSize: "13px",
    color: "#6b7280",
    textAlign: "left",
  },
  menuDivider: {
    height: "1px",
    backgroundColor: "#e5e7eb",
    margin: "8px 0",
  },
  menuItem: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px 16px",
    backgroundColor: "transparent",
    border: "none",
    color: "#1f2937",
    fontSize: "14px",
    fontWeight: "500",
    textAlign: "left",
    cursor: "pointer",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "#f9fafb",
    },
  },
  menuIcon: {
    fontSize: "16px",
    color: "#6b7280",
  },
  "@global": {
    "@keyframes fadeIn": {
      "0%": { opacity: 0, transform: "translateY(-10px)" },
      "100%": { opacity: 1, transform: "translateY(0)" },
    },
  },
};

export default AdminHeader;
