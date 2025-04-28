import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import ProfileHeader from "./ProfileHeader";
import Footer from "./Footer";
import UserSidebar from "../components/UserSidebar";
import { FiEdit, FiSave, FiUser, FiMail, FiPhone, FiCalendar, FiMapPin, FiHome } from "react-icons/fi";

const UserProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Fetch user data
    fetch("http://localhost:5000/api/user", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then((data) => setUser(data))
      .catch(() => navigate("/")) // Redirect if unauthorized
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:5000/update-user/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(user),
      });

      if (!response.ok) throw new Error("Failed to update profile");
      const data = await response.json();
      setSuccess("Profile updated successfully!");
      setError("");
      setUser(data);
      setIsEditing(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message);
      setSuccess("");
    }
  };

  if (loading) return <div style={styles.loadingContainer}><div style={styles.spinner}></div></div>;
  if (!user) return <p style={styles.error}>Error loading profile.</p>;

  return (
    <>
      <Header />
      <ProfileHeader />
      <div style={styles.container}>
        <UserSidebar />
        <main style={styles.main}>
          <div style={styles.header}>
            <h2 style={styles.title}>Profile Settings</h2>
            {isEditing ? (
              <button style={styles.saveButton} onClick={handleSave}>
                <FiSave style={styles.buttonIcon} /> Save Changes
              </button>
            ) : (
              <button style={styles.editButton} onClick={() => setIsEditing(true)}>
                <FiEdit style={styles.buttonIcon} /> Edit Profile
              </button>
            )}
          </div>

          {error && (
            <div style={styles.alertError}>
              {error}
            </div>
          )}

          {success && (
            <div style={styles.alertSuccess}>
              {success}
            </div>
          )}

          <div style={styles.profileCard}>
            <div style={styles.avatarSection}>
              <div style={styles.avatar}>
                {user.fullName?.charAt(0) || "U"}
              </div>
              <h3 style={styles.userName}>{user.fullName}</h3>
              <p style={styles.userEmail}>{user.email}</p>
            </div>

            <div style={styles.formSection}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <FiUser style={styles.inputIcon} /> Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  style={styles.input}
                  value={user.fullName || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <FiMail style={styles.inputIcon} /> Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  style={styles.input}
                  value={user.email || ""}
                  disabled
                />
              </div>

              <div style={styles.inputRow}>
                <div style={{ ...styles.inputGroup, flex: 1 }}>
                  <label style={styles.label}>
                    <FiPhone style={styles.inputIcon} /> Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    style={styles.input}
                    value={user.phone || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                <div style={{ ...styles.inputGroup, flex: 1 }}>
                  <label style={styles.label}>
                    <FiCalendar style={styles.inputIcon} /> Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dob"
                    style={styles.input}
                    value={user.dob || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <FiHome style={styles.inputIcon} /> Address
                </label>
                <textarea
                  name="address"
                  style={{ ...styles.input, ...styles.textarea }}
                  value={user.address || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                ></textarea>
              </div>

              <div style={styles.inputRow}>
                <div style={{ ...styles.inputGroup, flex: 1 }}>
                  <label style={styles.label}>
                    <FiMapPin style={styles.inputIcon} /> Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    style={styles.input}
                    value={user.country || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                <div style={{ ...styles.inputGroup, flex: 1 }}>
                  <label style={styles.label}>
                    <FiMapPin style={styles.inputIcon} /> City
                  </label>
                  <input
                    type="text"
                    name="city"
                    style={styles.input}
                    value={user.city || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

// Modern styling with animations
const styles = {
  container: {
    display: "flex",
    marginTop: "24px",
    maxWidth: "1200px",
    margin: "0 auto",
    gap: "30px",
    padding: "20px",
    fontFamily: "'Inter', sans-serif",
  },
  main: {
    flex: 1,
    minWidth: "0",
    background: "#fff",
    padding: "30px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
    borderRadius: "12px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#2d3748",
    margin: 0,
  },
  profileCard: {
    display: "flex",
    flexDirection: { xs: "column", md: "row" },
    gap: "40px",
  },
  avatarSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minWidth: "220px",
  },
  avatar: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "48px",
    fontWeight: "600",
    marginBottom: "20px",
  },
  userName: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#2d3748",
    margin: "8px 0 4px",
  },
  userEmail: {
    fontSize: "14px",
    color: "#718096",
    margin: 0,
  },
  formSection: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: "20px",
  },
  inputRow: {
    display: "flex",
    gap: "20px",
    marginBottom: "20px",
  },
  label: {
    display: "flex",
    alignItems: "center",
    fontSize: "14px",
    fontWeight: "500",
    color: "#4a5568",
    marginBottom: "8px",
  },
  inputIcon: {
    marginRight: "8px",
    color: "#667eea",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "15px",
    color: "#2d3748",
    transition: "all 0.3s ease",
    backgroundColor: "white",
  },
  textarea: {
    minHeight: "100px",
    resize: "vertical",
  },
  editButton: {
    background: "white",
    color: "#667eea",
    padding: "10px 20px",
    fontSize: "14px",
    borderRadius: "8px",
    border: "1px solid #667eea",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    fontWeight: "500",
    transition: "all 0.3s ease",
  },
  saveButton: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    padding: "10px 20px",
    fontSize: "14px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    fontWeight: "500",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  buttonIcon: {
    marginRight: "8px",
  },
  alertError: {
    background: "#fff5f5",
    color: "#e53e3e",
    padding: "12px 16px",
    borderRadius: "8px",
    marginBottom: "20px",
    borderLeft: "4px solid #e53e3e",
    display: "flex",
    alignItems: "center",
  },
  alertSuccess: {
    background: "#f0fff4",
    color: "#38a169",
    padding: "12px 16px",
    borderRadius: "8px",
    marginBottom: "20px",
    borderLeft: "4px solid #38a169",
    display: "flex",
    alignItems: "center",
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "5px solid #f3f3f3",
    borderTop: "5px solid #667eea",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  error: {
    color: "#e53e3e",
    textAlign: "center",
    padding: "40px",
    fontSize: "18px",
  },
};

// Add this to your global CSS
// @keyframes spin {
//   0% { transform: rotate(0deg); }
//   100% { transform: rotate(360deg); }
// }

export default UserProfilePage;