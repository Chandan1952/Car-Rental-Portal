import React from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const styles = {
  container: {
    padding: "40px 20px",
    fontFamily: "Arial, sans-serif",
    color: "#333",
    maxWidth: "900px",
    margin: "auto",
    lineHeight: "1.6",
  },
  title: {
    fontSize: "32px",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "10px",
  },
  subtitle: {
    textAlign: "center",
    fontSize: "14px",
    color: "gray",
    marginBottom: "30px",
  },
  section: {
    marginBottom: "25px",
    padding: "15px",
    borderRadius: "8px",
    background: "#f9f9f9",
  },
  heading: {
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#d32f2f",
  },
  paragraph: {
    fontSize: "18px",
  },
  list: {
    paddingLeft: "20px",
    fontSize: "18px",
  },
  linkContainer: {
    textAlign: "center",
    marginTop: "40px",
  },
  link: {
    textDecoration: "none",
    color: "#007bff",
    fontWeight: "bold",
    fontSize: "18px",
  },
};

const PrivacyPolicy = () => {
  return (
    <>
      <Header />
      <div style={styles.container}>
        <h1 style={styles.title}>Privacy Policy</h1>
        <p style={styles.subtitle}>Last Updated: March 1, 2025</p>

        <section style={styles.section}>
          <h2 style={styles.heading}>1. Introduction</h2>
          <p style={styles.paragraph}>
            Welcome to <strong>DriveEasy Rentals</strong>. We are committed to protecting your privacy. This Privacy Policy explains how we 
            collect, use, disclose, and safeguard your information when you visit our website.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>2. Information We Collect</h2>
          <ul style={styles.list}>
            <li><strong>Personal Information:</strong> Name, email, phone number, payment details.</li>
            <li><strong>Vehicle Rental Data:</strong> Booking history, preferred car models.</li>
            <li><strong>Technical Data:</strong> IP address, browser type, device information.</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>3. How We Use Your Information</h2>
          <ul style={styles.list}>
            <li>Process bookings and payments.</li>
            <li>Improve our services and customer experience.</li>
            <li>Send updates, offers, and promotional materials.</li>
            <li>Ensure security and prevent fraud.</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>4. Sharing Your Information</h2>
          <p style={styles.paragraph}>
            We do <strong>not</strong> sell your personal information. However, we may share it with:
          </p>
          <ul style={styles.list}>
            <li>Payment processors for transactions.</li>
            <li>Law enforcement if required.</li>
            <li>Service providers for platform functionality.</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>5. Data Security</h2>
          <p style={styles.paragraph}>
            We implement security measures to protect your personal data, but <strong>cannot guarantee complete security.</strong>
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>6. Your Rights</h2>
          <p style={styles.paragraph}>
            You have the right to <strong>access, update, or delete your data.</strong> Contact us at <strong>[support@email.com]</strong>.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>7. Cookies and Tracking</h2>
          <p style={styles.paragraph}>
            We use cookies to improve your experience. You can disable cookies in your browser settings.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>8. Contact Us</h2>
          <p style={styles.paragraph}>
            If you have any questions about this policy, contact us at <strong>[support@email.com]</strong>.
          </p>
        </section>

        <div style={styles.linkContainer}>
          <Link to="/" style={styles.link}>⬅ Back to Home</Link>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
