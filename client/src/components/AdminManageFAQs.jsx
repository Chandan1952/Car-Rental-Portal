import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import { FiEdit, FiTrash2, FiPlus, FiSave, FiX } from "react-icons/fi";

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
  },
  mainContent: {
    flex: 1,
    padding: "2rem",
    maxWidth: "1200px",
    margin: "0 auto",
    fontFamily: "'Inter', sans-serif",
    marginLeft: "280px",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    padding: "2rem",
    marginBottom: "2rem",
  },
  heading: {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: "1.5rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  input: {
    width: "100%",
    padding: "0.75rem 1rem",
    marginBottom: "1rem",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    fontSize: "0.95rem",
    boxSizing: "border-box",
    transition: "all 0.2s ease",
    backgroundColor: "#f8fafc",
    color: "#1e293b",
    outline: "none",
    "&:focus": {
      borderColor: "#6366f1",
      boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.1)",
    },
  },
  textarea: {
    minHeight: "120px",
    resize: "vertical",
  },
  button: {
    padding: "0.75rem 1.5rem",
    background: "#6366f1",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "8px",
    fontSize: "0.95rem",
    fontWeight: "500",
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    transition: "all 0.2s ease",
    "&:hover": {
      background: "#4f46e5",
    },
    "&:disabled": {
      background: "#cbd5e1",
      cursor: "not-allowed",
    },
  },
  secondaryButton: {
    background: "#e2e8f0",
    color: "#334155",
    "&:hover": {
      background: "#cbd5e1",
    },
  },
  dangerButton: {
    background: "#ef4444",
    "&:hover": {
      background: "#dc2626",
    },
  },
  successButton: {
    background: "#10b981",
    "&:hover": {
      background: "#059669",
    },
  },
  faqList: {
    marginTop: "2rem",
  },
  faqItem: {
    padding: "1.5rem",
    marginBottom: "1rem",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
    border: "1px solid #e2e8f0",
    transition: "all 0.2s ease",
    "&:hover": {
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
    },
  },
  faqQuestion: {
    fontWeight: "600",
    color: "#1e293b",
    fontSize: "1.05rem",
    marginBottom: "0.5rem",
  },
  faqAnswer: {
    color: "#64748b",
    lineHeight: "1.6",
  },
  faqActions: {
    display: "flex",
    gap: "0.5rem",
    marginTop: "1rem",
  },
  actionButton: {
    padding: "0.5rem 1rem",
    borderRadius: "6px",
    fontSize: "0.85rem",
    display: "inline-flex",
    alignItems: "center",
    gap: "0.3rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
    border: "none",
  },
  message: {
    padding: "1rem",
    borderRadius: "8px",
    marginBottom: "1.5rem",
    fontSize: "0.95rem",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  successMessage: {
    backgroundColor: "#ecfdf5",
    color: "#059669",
    border: "1px solid #a7f3d0",
  },
  errorMessage: {
    backgroundColor: "#fef2f2",
    color: "#dc2626",
    border: "1px solid #fecaca",
  },
  formHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
  },
  cancelButton: {
    background: "none",
    border: "none",
    color: "#64748b",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: "0.3rem",
    fontSize: "0.9rem",
    "&:hover": {
      color: "#475569",
    },
  },
};

export default function AdminFAQs() {
  const [faqs, setFaqs] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/faqs");
      setFaqs(response.data);
    } catch (error) {
      setMessage({ text: "Error fetching FAQs. Please try again.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!question.trim() || !answer.trim()) {
      setMessage({ text: "Both question and answer are required!", type: "error" });
      return;
    }

    setIsLoading(true);
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/faqs/${editingId}`, { question, answer });
        setMessage({ text: "FAQ updated successfully!", type: "success" });
      } else {
        await axios.post("http://localhost:5000/api/faqs", { question, answer });
        setMessage({ text: "FAQ added successfully!", type: "success" });
      }

      fetchFAQs();
      setQuestion("");
      setAnswer("");
      setEditingId(null);
    } catch (error) {
      setMessage({ text: error.response?.data?.message || "Failed to update FAQ.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (faq) => {
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setEditingId(faq._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this FAQ?")) return;

    setIsLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/faqs/${id}`);
      setMessage({ text: "FAQ deleted successfully!", type: "success" });
      fetchFAQs();
    } catch (error) {
      setMessage({ text: "Failed to delete FAQ.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setQuestion("");
    setAnswer("");
    setEditingId(null);
  };

  return (
    <>
      <AdminHeader />
      <div style={styles.container}>
        <AdminSidebar />
        <main style={styles.mainContent}>
          {/* FAQ Form Card */}
          <div style={styles.card}>
            <div style={styles.formHeader}>
              <h2 style={styles.heading}>
                {editingId ? (
                  <>
                    <FiEdit /> Edit FAQ
                  </>
                ) : (
                  <>
                    <FiPlus /> Add New FAQ
                  </>
                )}
              </h2>
              {editingId && (
                <button onClick={resetForm} style={styles.cancelButton}>
                  <FiX /> Cancel
                </button>
              )}
            </div>

            {message.text && (
              <div
                style={{
                  ...styles.message,
                  ...(message.type === "success" ? styles.successMessage : styles.errorMessage),
                }}
              >
                {message.text}
              </div>
            )}

            <input
              type="text"
              placeholder="Enter question (e.g., 'How do I reset my password?')"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              style={styles.input}
            />

            <textarea
              placeholder="Enter detailed answer..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              style={{ ...styles.input, ...styles.textarea }}
            />

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                onClick={handleSubmit}
                style={{
                  ...styles.button,
                  ...(editingId ? styles.successButton : {}),
                }}
                disabled={!question.trim() || !answer.trim() || isLoading}
              >
                {isLoading ? (
                  "Processing..."
                ) : editingId ? (
                  <>
                    <FiSave /> Update FAQ
                  </>
                ) : (
                  <>
                    <FiPlus /> Add FAQ
                  </>
                )}
              </button>

              {editingId && (
                <button onClick={resetForm} style={{ ...styles.button, ...styles.secondaryButton }}>
                  <FiX /> Cancel
                </button>
              )}
            </div>
          </div>

          {/* FAQ List Card */}
          <div style={styles.card}>
            <h2 style={styles.heading}>
              <FiEdit /> Manage FAQs
            </h2>
            
            {isLoading && !faqs.length ? (
              <div style={{ textAlign: "center", padding: "2rem", color: "#64748b" }}>
                Loading FAQs...
              </div>
            ) : faqs.length === 0 ? (
              <div style={{ textAlign: "center", padding: "2rem", color: "#64748b" }}>
                No FAQs found. Add your first FAQ above.
              </div>
            ) : (
              <div style={styles.faqList}>
                {faqs.map((faq) => (
                  <div key={faq._id} style={styles.faqItem}>
                    <div style={styles.faqQuestion}>{faq.question}</div>
                    <div style={styles.faqAnswer}>{faq.answer}</div>
                    <div style={styles.faqActions}>
                      <button
                        onClick={() => handleEdit(faq)}
                        style={{ ...styles.actionButton, ...styles.secondaryButton }}
                      >
                        <FiEdit size={14} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(faq._id)}
                        style={{ ...styles.actionButton, ...styles.dangerButton }}
                      >
                        <FiTrash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}