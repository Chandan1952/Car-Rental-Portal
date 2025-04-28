import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import Header from "./Header";
import Footer from "./Footer";
import CarRentalHomePage from "./CarRentalHomePage";

const BASE_URL = "http://localhost:5000";
const RAZORPAY_KEY_ID = "rzp_test_rv1bH6Okprpr7t";


export default function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [error, setError] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [userId, setUserId] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [accessories, setAccessories] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [activeTab, setActiveTab] = useState("details");

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];

  const fetchCarDetails = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/car-details/${id}`);
      if (response.data) {
        setCar(response.data);
        setAccessories(response.data.accessories || []);
        setError(null);
      } else {
        setError("Car details not found.");
      }
    } catch (error) {
      console.error("Error fetching car details:", error);
      setError("Failed to load car details. Please try again.");
    }
  }, [id]);

  const fetchUserSession = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/userid`, { withCredentials: true });
      if (response.data?.id) {
        setUserId(response.data.id);
      } else {
        setUserId(null);
      }
    } catch (error) {
      console.error("Error fetching user session:", error);
      setUserId(null);
    }
  }, []);

  useEffect(() => {
    fetchCarDetails();
    fetchUserSession();
  }, [fetchCarDetails, fetchUserSession]);



  useEffect(() => {
    if (!car || !fromDate || !toDate) return;
  
    const calculateTotalAmount = () => {
      const days = Math.ceil((new Date(toDate) - new Date(fromDate)) / (1000 * 3600 * 24));
      const amount = car.pricePerDay * (days > 0 ? days : 1);
      setTotalAmount(amount);
    };
  
    calculateTotalAmount();
  }, [fromDate, toDate, car]);
  
  
  const handleCODBooking = async () => {
    try {
      const bookingData = {
        carId: id,
        fromDate,
        toDate,
        location: selectedState,
        paymentId: "COD",
      };

      const response = await axios.post(`${BASE_URL}/api/bookings`, bookingData, { withCredentials: true });

      if (response.status === 201) {
        alert("Booking confirmed with Cash on Delivery! ✅");
        setBookingSuccess("Booking confirmed!");
        setFromDate("");
        setToDate("");
        setSelectedState("");
        navigate("/my-booking");

      }
    } catch (error) {
      console.error("Booking failed:", error);
      setBookingSuccess("Booking failed. Please try again.");
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleOnlineBooking = async () => {
    if (!fromDate || !toDate || !selectedState) {
      alert("Please fill in all booking details.");
      return;
    }
  
    if (!userId) {
      alert("You must be logged in to book a car.");
      navigate("/");
      return;
    }
  
    const res = await loadRazorpayScript();
    if (!res) {
      alert("Failed to load Razorpay SDK. Please check your internet connection.");
      return;
    }
  
    const days = Math.ceil((new Date(toDate) - new Date(fromDate)) / (1000 * 3600 * 24));
    const amount = car.pricePerDay * (days > 0 ? days : 1);
  
    try {
      const orderResponse = await axios.post(`${BASE_URL}/api/create-order`, { amount }, { withCredentials: true });
      if (orderResponse.status !== 200) {
        throw new Error("Failed to create order with Razorpay.");
      }
  
      const { id: order_id, amount: orderAmount } = orderResponse.data;
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: orderAmount,
        currency: "INR",
        name: "Car Rental Booking",
        description: `Booking for ${car.brand} - ${car.model}`,
        order_id,
        handler: async (response) => {
          try {
            const verifyRes = await axios.post(`${BASE_URL}/api/verify-payment`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }, { withCredentials: true });
  
            if (verifyRes.status === 200) {
              const bookingData = {
                carId: id,
                fromDate,
                toDate,
                location: selectedState,
                paymentId: response.razorpay_payment_id,
                amount, // Include the calculated amount
              };
  
              const bookingRes = await axios.post(`${BASE_URL}/api/bookings`, bookingData, { withCredentials: true });
  
              if (bookingRes.status === 201) {
                alert("Booking confirmed and payment successful! ✅");
                setBookingSuccess("Booking confirmed!");
                setFromDate("");
                setToDate("");
                setSelectedState("");
                navigate("/my-booking");
              } else {
                throw new Error("Failed to complete the booking.");
              }
            } else {
              throw new Error("Payment verification failed.");
            }
          } catch (error) {
            console.error("Payment verification failed:", error);
            alert("Payment verification failed. Please try again.");
          }
        },
        prefill: {
          name: "Customer",
        },
        theme: {
          color: "#3399cc",
        },
      };
  
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Online booking failed:", error);
      alert(`Booking failed: ${error.message}. Please try again.`);
    }
  };
  


    if (error) return <div style={{ padding: "24px", textAlign: "center", color: "#ef4444" }}>{error}</div>;
    if (!car) return <div style={{ padding: "24px", textAlign: "center" }}>Loading...</div>;
  
    const imageUrl = car.images?.length
      ? `${BASE_URL}${car.images[0].startsWith("/") ? car.images[0] : "/" + car.images[0]}`
      : "https://via.placeholder.com/900x300?text=No+Image";
  
    return (
      <div style={styles.container}>
        <Header />
        
        <main style={styles.main}>
          {/* Breadcrumbs */}
          <div style={styles.breadcrumbs}>
            <span style={{ ...styles.breadcrumbItem, ...styles.breadcrumbActive }}>Home</span>
            <span style={styles.breadcrumbArrow}>›</span>
            <span style={styles.breadcrumbItem}>Cars</span>
            <span style={styles.breadcrumbArrow}>›</span>
            <span style={{ ...styles.breadcrumbItem, ...styles.breadcrumbActive }}>
              {car.brand} {car.model}
            </span>
          </div>
          
          <div style={styles.layout}>
            <div style={styles.contentRow}>
              {/* Left Column - Car Images */}
              <div style={styles.leftColumn}>
                <div style={styles.imageContainer}>
                  <Zoom>
                    <img
                      src={imageUrl}
                      alt={car.model}
                      style={styles.mainImage}
                    />
                  </Zoom>
                  
                  {/* Thumbnail Gallery */}
                  <div style={styles.thumbnailGallery}>
                    {[1, 2, 3].map((i) => (
                      <img 
                        key={i}
                        src={imageUrl}
                        style={styles.thumbnail}
                        alt={`Thumbnail ${i}`}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Tabs */}
                <div style={styles.tabsContainer}>
                  <div style={styles.tabsHeader}>
                    <button 
                      style={{
                        ...styles.tabButton,
                        ...(activeTab === "details" ? styles.tabButtonActive : styles.tabButtonInactive)
                      }}
                      onClick={() => setActiveTab("details")}
                    >
                      Details
                    </button>
                    <button 
                      style={{
                        ...styles.tabButton,
                        ...(activeTab === "specs" ? styles.tabButtonActive : styles.tabButtonInactive)
                      }}
                      onClick={() => setActiveTab("specs")}
                    >
                      Specifications
                    </button>
                    <button 
                      style={{
                        ...styles.tabButton,
                        ...(activeTab === "reviews" ? styles.tabButtonActive : styles.tabButtonInactive)
                      }}
                      onClick={() => setActiveTab("reviews")}
                    >
                      Reviews
                    </button>
                  </div>
                  
                  <div style={styles.tabContent}>
                    {activeTab === "details" && (
                      <div>
                        <h3 style={styles.tabTitle}>About This Vehicle</h3>
                        <p style={styles.tabText}>
                          Experience the perfect blend of luxury and performance with this {car.brand} {car.model}. 
                          This {car.modelYear} model comes with {car.fuelType} engine and comfortable seating for {car.seatingCapacity}.
                        </p>
                        
                        <h4 style={{ fontWeight: "500", marginBottom: "8px" }}>Key Features:</h4>
                        <div style={styles.featureList}>
                          {accessories.map((item, i) => (
                            <div key={i} style={styles.featureItem}>
                              <div style={styles.featureIcon}>
                                <svg style={styles.checkIcon} viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {activeTab === "specs" && (
                      <div>
                        <h3 style={styles.tabTitle}>Technical Specifications</h3>
                        <div style={styles.specGrid}>
                          <div style={styles.specItem}>
                            <span style={styles.specIcon}>🚗</span>
                            <div>
                              <div style={styles.specTitle}>Make</div>
                              <div style={styles.specValue}>{car.brand}</div>
                            </div>
                          </div>
                          <div style={styles.specItem}>
                            <span style={styles.specIcon}>📅</span>
                            <div>
                              <div style={styles.specTitle}>Year</div>
                              <div style={styles.specValue}>{car.modelYear}</div>
                            </div>
                          </div>
                          <div style={styles.specItem}>
                            <span style={styles.specIcon}>⛽</span>
                            <div>
                              <div style={styles.specTitle}>Fuel Type</div>
                              <div style={styles.specValue}>{car.fuelType}</div>
                            </div>
                          </div>
                          <div style={styles.specItem}>
                            <span style={styles.specIcon}>💺</span>
                            <div>
                              <div style={styles.specTitle}>Seats</div>
                              <div style={styles.specValue}>{car.seatingCapacity}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {activeTab === "reviews" && (
                      <div>
                        <h3 style={styles.tabTitle}>Customer Reviews</h3>
                        <div style={{ backgroundColor: "#f3f4f6", padding: "16px", borderRadius: "8px" }}>
                          <p style={{ color: "#4b5563" }}>No reviews yet. Be the first to review this vehicle!</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Right Column - Booking Form */}
              <div style={styles.rightColumn}>
                <div style={styles.bookingContainer}>
                  <h2 style={styles.carTitle}>{car.brand} {car.model}</h2>
                  <p style={styles.carSubtitle}>{car.modelYear} • {car.fuelType}</p>
                  
                  <div style={styles.priceContainer}>
                    <span style={styles.price}>₹{car.pricePerDay}</span>
                    <span style={styles.priceLabel}>/ day</span>
                  </div>
                  
                  <div style={{ marginBottom: "24px" }}>
                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Pickup Date</label>
                      <input 
                        type="date" 
                        style={styles.formInput}
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                      />
                    </div>
                    
                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Return Date</label>
                      <input 
                        type="date" 
                        style={styles.formInput}
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                      />
                    </div>
                    
                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Pickup Location</label>
                      <select 
                        style={styles.formInput}
                        value={selectedState}
                        onChange={(e) => setSelectedState(e.target.value)}
                      >
                        <option value="">-- Select State --</option>
                        {indianStates.map((state, index) => (
                          <option key={index} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div style={styles.summaryContainer}>
                    <div style={styles.summaryRow}>
                      <span style={{ color: "#374151" }}>Subtotal:</span>
                      <span style={{ fontWeight: "500" }}>₹{car.pricePerDay}</span>
                    </div>
                    {/* <div style={styles.summaryRow}>
                      <span style={{ color: "#374151" }}>Taxes & Fees:</span>
                      <span style={{ fontWeight: "500" }}>₹500</span>
                    </div> */}
                    <div style={styles.summaryTotal}>
                      <span style={{ fontWeight: "700" }}>Total:</span>
                      <span style={styles.totalPrice}>₹{totalAmount}</span>
                    </div>
                  </div>
                  
                  <div style={styles.buttonGroup}>
                    <button 
                      style={styles.primaryButton}
                      onClick={handleOnlineBooking}
                    >
                      <span style={{ marginRight: "8px" }}>💳</span>
                      Pay & Book Now
                    </button>
                    
                    <button 
                      style={styles.secondaryButton}
                      onClick={handleCODBooking}
                    >
                      <span style={{ marginRight: "8px" }}>💰</span>
                      Book with Cash on Delivery
                    </button>
                  </div>
                  
                  {bookingSuccess && (
                    <div style={styles.successMessage}>
                      {bookingSuccess}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
        <CarRentalHomePage />
        <Footer />
      </div>
    );
  }


    // Styles
    const styles = {
      container: {
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f8fafc",
      },
      main: {
        flexGrow: 1,
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "32px 16px",
        width: "100%",
      },
      breadcrumbs: {
        display: "flex",
        alignItems: "center",
        fontSize: "14px",
        color: "#4b5563",
        marginBottom: "24px",
      },
      breadcrumbItem: {
        cursor: "pointer",
        margin: "0 4px",
      },
      breadcrumbActive: {
        fontWeight: "500",
        color: "#1f2937",
      },
      breadcrumbArrow: {
        margin: "0 8px",
        color: "#9ca3af",
      },
      layout: {
        display: "flex",
        flexDirection: "column",
      },
      contentRow: {
        display: "flex",
        flexDirection: "column",
        gap: "32px",
      },
      leftColumn: {
        width: "100%",
      },
      rightColumn: {
        width: "100%",
      },
      imageContainer: {
        backgroundColor: "white",
        borderRadius: "12px",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        overflow: "hidden",
      },
      mainImage: {
        width: "100%",
        height: "384px",
        objectFit: "cover",
        cursor: "zoom-in",
      },
      thumbnailGallery: {
        display: "flex",
        padding: "16px",
        gap: "8px",
        overflowX: "auto",
      },
      thumbnail: {
        width: "80px",
        height: "64px",
        objectFit: "cover",
        borderRadius: "4px",
        cursor: "pointer",
        border: "2px solid transparent",
      },
      thumbnailHover: {
        border: "2px solid #3b82f6",
      },
      tabsContainer: {
        marginTop: "32px",
        backgroundColor: "white",
        borderRadius: "12px",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        overflow: "hidden",
      },
      tabsHeader: {
        display: "flex",
        borderBottom: "1px solid #e5e7eb",
      },
      tabButton: {
        padding: "12px 24px",
        fontWeight: "500",
        cursor: "pointer",
      },
      tabButtonActive: {
        color: "#2563eb",
        borderBottom: "2px solid #2563eb",
      },
      tabButtonInactive: {
        color: "#4b5563",
      },
      tabContent: {
        padding: "24px",
      },
      tabTitle: {
        fontSize: "20px",
        fontWeight: "600",
        marginBottom: "16px",
      },
      tabText: {
        color: "#374151",
        marginBottom: "16px",
      },
      featureList: {
        display: "grid",
        gridTemplateColumns: "repeat(1, 1fr)",
        gap: "8px",
        marginBottom: "24px",
      },
      featureItem: {
        display: "flex",
        alignItems: "center",
      },
      featureIcon: {
        width: "20px",
        height: "20px",
        backgroundColor: "#dbeafe",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginRight: "8px",
      },
      checkIcon: {
        width: "12px",
        height: "12px",
        color: "#2563eb",
      },
      bookingContainer: {
        backgroundColor: "white",
        borderRadius: "12px",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        position: "sticky",
        top: "16px",
        padding: "24px",
      },
      carTitle: {
        fontSize: "24px",
        fontWeight: "700",
        marginBottom: "8px",
      },
      carSubtitle: {
        color: "#4b5563",
        marginBottom: "16px",
      },
      priceContainer: {
        display: "flex",
        alignItems: "center",
        marginBottom: "24px",
      },
      price: {
        fontSize: "28px",
        fontWeight: "700",
        color: "#2563eb",
      },
      priceLabel: {
        color: "#6b7280",
        marginLeft: "4px",
      },
      formGroup: {
        marginBottom: "16px",
      },
      formLabel: {
        display: "block",
        fontSize: "14px",
        fontWeight: "500",
        color: "#374151",
        marginBottom: "4px",
      },
      formInput: {
        width: "90%",
        padding: "8px 16px",
        border: "1px solid #d1d5db",
        borderRadius: "8px",
        outline: "none",
      },
      formInputFocus: {
        borderColor: "#3b82f6",
        boxShadow: "0 0 0 1px #3b82f6",
      },
      summaryContainer: {
        marginTop: "24px",
        padding: "16px",
        backgroundColor: "#eff6ff",
        borderRadius: "8px",
      },
      summaryRow: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "8px",
      },
      summaryTotal: {
        display: "flex",
        justifyContent: "space-between",
        paddingTop: "8px",
        borderTop: "1px solid #d1d5db",
        fontWeight: "700",
      },
      totalPrice: {
        fontSize: "20px",
        fontWeight: "700",
        color: "#2563eb",
      },
      buttonGroup: {
        marginTop: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      },
      primaryButton: {
        width: "100%",
        backgroundColor: "#2563eb",
        color: "white",
        padding: "12px 16px",
        borderRadius: "8px",
        fontWeight: "500",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        border: "none",
      },
      primaryButtonHover: {
        backgroundColor: "#1d4ed8",
      },
      secondaryButton: {
        width: "100%",
        backgroundColor: "#1f2937",
        color: "white",
        padding: "12px 16px",
        borderRadius: "8px",
        fontWeight: "500",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        border: "none",
      },
      secondaryButtonHover: {
        backgroundColor: "#111827",
      },
      successMessage: {
        marginTop: "16px",
        padding: "12px",
        backgroundColor: "#dcfce7",
        color: "#166534",
        borderRadius: "8px",
        fontSize: "14px",
      },
      specGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "16px",
      },
      specItem: {
        display: "flex",
        alignItems: "center",
      },
      specIcon: {
        marginRight: "8px",
        color: "#2563eb",
      },
      specTitle: {
        fontWeight: "500",
        marginBottom: "4px",
      },
      specValue: {
        color: "#4b5563",
      },
    };
  