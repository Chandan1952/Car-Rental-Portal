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
    color: "#d32f2f", // Stylish red accent
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
    transition: "color 0.3s ease",
  },
};

const TermsOfUse = () => {
  return (
    <>
      <Header />
      <div style={styles.container}>
        <h1 style={styles.title}>Terms of Use</h1>
        <p style={styles.subtitle}>Last Updated: March 1, 2025</p>

        <section style={styles.section}>
          <h2 style={styles.heading}>1. Acceptance of Terms</h2>
          <p style={styles.paragraph}>
            By using <strong>DriveEasy Rentals</strong>, you agree to these Terms of Use. If you do not agree, please do not use our services.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>2. Eligibility</h2>
          <p style={styles.paragraph}>
            You must be <strong>at least 21 years old</strong> and have a <strong>valid driver’s license</strong> to rent a vehicle through our platform.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>3. Booking and Payment</h2>
          <ul style={styles.list}>
            <li>All bookings must be completed through our official platform.</li>
            <li>Payment is required at the time of booking.</li>
            <li>We accept major credit cards and digital payments.</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>4. Cancellation and Refunds</h2>
          <p style={styles.paragraph}>
            Cancellations must be made at least <strong>24 hours before</strong> the rental start time for a <strong>full refund</strong>. Late cancellations may be subject to fees.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>5. User Responsibilities</h2>
          <ul style={styles.list}>
            <li>Return the rented vehicle in the <strong>same condition</strong> it was received.</li>
            <li>Report any <strong>damage</strong> to the vehicle immediately.</li>
            <li>Late returns may result in <strong>additional charges</strong>.</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>6. Prohibited Activities</h2>
          <p style={styles.paragraph}>
            Users <strong>may not</strong> use rental vehicles for illegal activities, racing, or unauthorized modifications.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>7. Limitation of Liability</h2>
          <p style={styles.paragraph}>
            We are <strong>not responsible</strong> for any damages, accidents, or losses incurred while using our rental services.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>8. Changes to Terms</h2>
          <p style={styles.paragraph}>
            We reserve the right to <strong>modify these terms</strong> at any time. Users will be notified of significant changes.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.heading}>9. Contact Information</h2>
          <p style={styles.paragraph}>
            If you have any questions, please contact us at <strong>support@email.com</strong>.
          </p>
        </section>

        <div style={styles.linkContainer}>
          <Link
            to="/"
            style={styles.link}
            onMouseOver={(e) => (e.currentTarget.style.color = "#0056b3")}
            onMouseOut={(e) => (e.currentTarget.style.color = "#007bff")}
          >
            ⬅ Back to Home
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TermsOfUse;
