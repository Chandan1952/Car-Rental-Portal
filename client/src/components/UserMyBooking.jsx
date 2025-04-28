import React, { useState, useEffect } from "react";
import { FaTimesCircle, FaCheckCircle, FaClock, FaCar, FaCalendarAlt, FaMoneyBillWave, FaCreditCard } from "react-icons/fa";
import axios from "axios";
import Header from "./Header";
import ProfileHeader from "./ProfileHeader";
import Footer from "./Footer";
import UserSidebar from "../components/UserSidebar";
import { PulseLoader } from "react-spinners";

const BASE_URL = "https://car-rental-portal-backend.onrender.com";

export default function UserMyBooking() {
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/mybookings`, { withCredentials: true });
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setMessage({ text: "Error fetching bookings. Please try again.", type: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await axios.delete(`${BASE_URL}/api/mybookings/${bookingId}`, { withCredentials: true });
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: "Cancelled" } : b))
      );
      setMessage({ text: "Booking cancelled successfully.", type: "success" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    } catch (error) {
      console.error("Error cancelling booking:", error);
      setMessage({ text: "Error cancelling booking. Please try again.", type: "error" });
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === "all") return true;
    return booking.status.toLowerCase() === activeTab.toLowerCase();
  });

  const statusCounts = bookings.reduce((acc, booking) => {
    const status = booking.status.toLowerCase();
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, { all: bookings.length });

  return (
    <>
      <Header />
      <ProfileHeader />
      <div style={styles.container}>
        <UserSidebar />
        <div style={styles.mainContent}>
          <div style={styles.header}>
            <h2 style={styles.title}>My Bookings</h2>
            <div style={styles.tabs}>
              {["all", "approved", "pending", "cancelled"].map((tab) => (
                <button
                  key={tab}
                  style={{
                    ...styles.tabButton,
                    ...(activeTab === tab ? styles.activeTab : {}),
                  }}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)} ({statusCounts[tab] || 0})
                </button>
              ))}
            </div>
          </div>

          {message.text && (
            <div style={{
              ...styles.alert,
              backgroundColor: message.type === "error" ? "#FFF5F5" : "#F0FFF4",
              color: message.type === "error" ? "#E53E3E" : "#38A169",
              borderLeft: `4px solid ${message.type === "error" ? "#E53E3E" : "#38A169"}`
            }}>
              {message.text}
            </div>
          )}

          {loading ? (
            <div style={styles.loadingContainer}>
              <PulseLoader color="#667eea" size={12} />
            </div>
          ) : filteredBookings.length > 0 ? (
            <div style={styles.bookingGrid}>
              {filteredBookings.map((booking) => (
                <div key={booking._id} style={styles.bookingCard}>
                  <div style={styles.cardHeader}>
                    <img
                      src={
                        booking.carId?.images?.length
                          ? `${BASE_URL}${booking.carId.images[0].startsWith("/") ? booking.carId.images[0] : "/" + booking.carId.images[0]}`
                          : "https://via.placeholder.com/300x200?text=No+Image"
                      }
                      alt="Car"
                      style={styles.carImage}
                    />
                    <div style={styles.carTitle}>
                      <h3>{booking.carId?.brand} {booking.carId?.model}</h3>
                      <p style={styles.carYear}>{booking.carId?.modelYear}</p>
                    </div>
                  </div>

                  <div style={styles.bookingDetails}>
                    <div style={styles.detailItem}>
                      <FaCalendarAlt style={styles.detailIcon} />
                      <div>
                        <p style={styles.detailLabel}>Booking Dates</p>
                        <p style={styles.detailValue}>
                          {new Date(booking.fromDate).toLocaleDateString()} - {new Date(booking.toDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div style={styles.detailItem}>
                      <FaMoneyBillWave style={styles.detailIcon} />
                      <div>
                        <p style={styles.detailLabel}>Total Amount</p>
                        <p style={styles.detailValue}>
                          {typeof booking.amount === "number" ? `₹${booking.amount.toLocaleString()}` : "N/A"}
                        </p>
                      </div>
                    </div>

                    <div style={styles.detailItem}>
                      <FaCreditCard style={styles.detailIcon} />
                      <div>
                        <p style={styles.detailLabel}>Payment Method</p>
                        <p style={styles.detailValue}>
                          {booking.paymentId === "COD" ? "Cash on Delivery" : "Paid Online"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div style={styles.cardFooter}>
                    <span
                      style={{
                        ...styles.statusBadge,
                        ...(booking.status === "Cancelled"
                          ? styles.cancelled
                          : booking.status === "Approved"
                            ? styles.confirmed
                            : styles.pending),
                      }}
                    >
                      {booking.status === "Cancelled" ? (
                        <>
                          <FaTimesCircle /> Cancelled
                        </>
                      ) : booking.status === "Approved" ? (
                        <>
                          <FaCheckCircle /> Approved
                        </>
                      ) : (
                        <>
                          <FaClock /> Pending
                        </>
                      )}
                    </span>

                    {booking.status !== "Cancelled" && (
                      <button
                        style={styles.cancelButton}
                        onClick={() => handleCancel(booking._id)}
                      >
                        <FaTimesCircle /> Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.emptyState}>
              <FaCar style={styles.emptyIcon} />
              <h3>No bookings found</h3>
              <p>You don't have any {activeTab !== "all" ? activeTab : ""} bookings yet.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

const styles = {
  container: {
    display: "flex",
    marginTop: "32px",
    padding: "0 24px",
    maxWidth: "1400px",
    marginLeft: "auto",
    marginRight: "auto",
    gap: "32px",
    fontFamily: "'Inter', sans-serif",
  },
  mainContent: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: "32px",
    borderRadius: "16px",
    boxShadow: "0 4px 30px rgba(0,0,0,0.05)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    flexWrap: "wrap",
    gap: "16px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#2D3748",
    margin: "0",
  },
  tabs: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  tabButton: {
    padding: "8px 16px",
    borderRadius: "8px",
    border: "1px solid #E2E8F0",
    backgroundColor: "white",
    color: "#4A5568",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.2s ease",
  },
  activeTab: {
    backgroundColor: "#667EEA",
    color: "white",
    borderColor: "#667EEA",
  },
  alert: {
    padding: "16px",
    borderRadius: "8px",
    marginBottom: "24px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "200px",
  },
  bookingGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
    gap: "24px",
  },
  bookingCard: {
    border: "1px solid #EDF2F7",
    borderRadius: "12px",
    overflow: "hidden",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    backgroundColor: "white",
    ":hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
    },
  },
  cardHeader: {
    position: "relative",
  },
  carImage: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    borderBottom: "1px solid #EDF2F7",
  },
  carTitle: {
    padding: "16px 16px 0",
  },
  carYear: {
    color: "#718096",
    fontSize: "14px",
    margin: "4px 0 0",
  },
  bookingDetails: {
    padding: "16px",
  },
  detailItem: {
    display: "flex",
    gap: "12px",
    marginBottom: "16px",
    alignItems: "flex-start",
  },
  detailIcon: {
    color: "#667EEA",
    fontSize: "18px",
    marginTop: "2px",
  },
  detailLabel: {
    color: "#718096",
    fontSize: "13px",
    margin: "0 0 2px",
    fontWeight: "500",
  },
  detailValue: {
    color: "#2D3748",
    fontSize: "15px",
    margin: "0",
    fontWeight: "600",
  },
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
    borderTop: "1px solid #EDF2F7",
    backgroundColor: "#F8FAFC",
  },
  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 12px",
    borderRadius: "20px",
    fontWeight: "600",
    fontSize: "14px",
  },
  confirmed: {
    backgroundColor: "#EBF8FF",
    color: "#3182CE",
  },
  cancelled: {
    backgroundColor: "#FFF5F5",
    color: "#E53E3E",
  },
  pending: {
    backgroundColor: "#FFFAF0",
    color: "#DD6B20",
  },
  cancelButton: {
    padding: "8px 16px",
    backgroundColor: "white",
    color: "#E53E3E",
    border: "1px solid #FC8181",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    transition: "all 0.2s ease",
    ":hover": {
      backgroundColor: "#FFF5F5",
    },
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    textAlign: "center",
    color: "#718096",
  },
  emptyIcon: {
    fontSize: "48px",
    color: "#CBD5E0",
    marginBottom: "16px",
  },
};
