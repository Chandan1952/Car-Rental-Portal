import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaChevronDown, FaChevronUp, FaSearch } from "react-icons/fa";
import Header from "./Header";
import Footer from "./Footer";

export default function FAQs() {
  const [faqs, setFaqs] = useState([]);
  const [filteredFaqs, setFilteredFaqs] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchFAQs();
  }, []);

  useEffect(() => {
    const results = faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFaqs(results);
  }, [searchTerm, faqs]);

  const fetchFAQs = async () => {
    try {
      const response = await axios.get("https://car-rental-portal-backend.onrender.com/api/faqs");
      setFaqs(response.data);
      setFilteredFaqs(response.data);
    } catch (error) {
      console.error("Error fetching FAQs", error);
    }
  };

  const toggleAnswer = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <Header />
      <main style={styles.container}>
        <div style={styles.hero}>
          <h1 style={styles.heading}>How can we help you?</h1>
          <p style={styles.subheading}>Find answers to common questions about our services</p>
          
          <div style={styles.searchContainer}>
            <FaSearch style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>
        </div>

        <section style={styles.faqSection}>
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <div key={faq._id} style={styles.faqItem}>
                <button
                  className="faq-question"
                  style={{
                    ...styles.question,
                    backgroundColor: openIndex === index ? "#f0f7ff" : "#f8f9fa"
                  }}
                  onClick={() => toggleAnswer(index)}
                  aria-expanded={openIndex === index}
                >
                  <span style={styles.questionText}>{faq.question}</span>
                  {openIndex === index ? (
                    <FaChevronUp style={styles.chevron} />
                  ) : (
                    <FaChevronDown style={styles.chevron} />
                  )}
                </button>
                <div
                  style={{
                    ...styles.answer,
                    maxHeight: openIndex === index ? "500px" : "0px",
                    opacity: openIndex === index ? "1" : "0",
                    padding: openIndex === index ? "20px" : "0px 20px",
                  }}
                >
                  {faq.answer}
                </div>
              </div>
            ))
          ) : (
            <div style={styles.noResults}>
              <h3>No results found</h3>
              <p>Try searching with different keywords</p>
            </div>
          )}
        </section>

        <div style={styles.contactCard}>
          <h3 style={styles.contactTitle}>Still have questions?</h3>
          <p style={styles.contactText}>
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <button style={styles.contactButton}>Contact Support</button>
        </div>
      </main>
      <Footer />
    </>
  );
}

// Modern styling with animations
const styles = {
  container: {
    padding: "0 20px 60px",
    maxWidth: "900px",
    margin: "0 auto",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  hero: {
    textAlign: "center",
    padding: "60px 20px 40px",
    background: "linear-gradient(135deg, #6e8efb, #a777e3)",
    borderRadius: "12px",
    marginBottom: "40px",
    color: "white",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  },
  heading: {
    fontSize: "2.5rem",
    fontWeight: "700",
    marginBottom: "1rem",
    lineHeight: "1.2",
  },
  subheading: {
    fontSize: "1.2rem",
    opacity: "0.9",
    marginBottom: "2rem",
  },
  searchContainer: {
    position: "relative",
    maxWidth: "600px",
    margin: "0 auto",
  },
  searchIcon: {
    position: "absolute",
    left: "20px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#666",
    fontSize: "1.2rem",
  },
  searchInput: {
    width: "100%",
    padding: "15px 20px 15px 50px",
    borderRadius: "50px",
    border: "none",
    fontSize: "1rem",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    transition: "all 0.3s ease",
    outline: "none",
  },
  faqSection: {
    margin: "40px 0",
  },
  faqItem: {
    marginBottom: "10px",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    transition: "all 0.3s ease",
  },
  question: {
    fontSize: "1.1rem",
    fontWeight: "600",
    cursor: "pointer",
    padding: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    border: "none",
    textAlign: "left",
    transition: "all 0.3s ease",
  },
  questionText: {
    flex: "1",
    paddingRight: "10px",
  },
  chevron: {
    transition: "transform 0.3s ease",
    color: "#4a6cf7",
  },
  answer: {
    fontSize: "1rem",
    lineHeight: "1.6",
    color: "#555",
    borderLeft: "4px solid #4a6cf7",
    background: "white",
    transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1)",
    overflow: "hidden",
  },
  noResults: {
    textAlign: "center",
    padding: "40px",
    color: "#666",
  },
  contactCard: {
    background: "white",
    borderRadius: "12px",
    padding: "30px",
    textAlign: "center",
    boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
    marginTop: "40px",
  },
  contactTitle: {
    fontSize: "1.5rem",
    marginBottom: "15px",
    color: "#333",
  },
  contactText: {
    fontSize: "1rem",
    color: "#666",
    marginBottom: "20px",
    lineHeight: "1.6",
  },
  contactButton: {
    background: "linear-gradient(135deg, #6e8efb, #a777e3)",
    color: "white",
    border: "none",
    padding: "12px 30px",
    borderRadius: "50px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(106, 118, 251, 0.3)",
  },
};
