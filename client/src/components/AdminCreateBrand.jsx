import React, { useState } from "react";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

const CreateBrand = () => {
  const [brandName, setBrandName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!brandName.trim()) return;
    
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await fetch("http://localhost:5000/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: brandName }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ text: "Brand added successfully!", type: "success" });
        setBrandName("");
      } else {
        setMessage({ text: data.message || "Failed to add brand", type: "error" });
      }
    } catch (error) {
      setMessage({ text: "Error connecting to the server", type: "error" });
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-layout">
      <AdminHeader />
      <div className="admin-container">
        <AdminSidebar />
        <main className="admin-content">
          <div className="content-header">
            <h1>Create New Brand</h1>
            <p className="subtitle">Add a new brand to your Vehicles catalog</p>
          </div>
          
          <div className="card">
            <div className="card-header">
              <h2>Brand Information</h2>
            </div>
            
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="brandName">Brand Name *</label>
                  <input
                    id="brandName"
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="e.g. BMW, Mahindra, Toyota"
                    className="form-control"
                    required
                  />
                  <small className="form-hint">
                    Enter the brand name as you want it to appear
                  </small>
                </div>
                
                <div className="form-actions">
                  <button 
                    type="submit" 
                    className={`btn btn-primary ${loading ? 'loading' : ''}`}
                    disabled={loading || !brandName.trim()}
                  >
                    {loading ? (
                      <>
                        <span className="spinner"></span>
                        Processing...
                      </>
                    ) : (
                      "Create Brand"
                    )}
                  </button>
                </div>
              </form>
              
              {message.text && (
                <div className={`alert alert-${message.type}`}>
                  {message.type === "success" ? (
                    <i className="icon-check-circle"></i>
                  ) : (
                    <i className="icon-alert-circle"></i>
                  )}
                  {message.text}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      
      <style jsx>{`
        .admin-layout {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background-color: #f5f7fa;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        .admin-container {
          display: flex;
          flex: 1;
        }
        
        .admin-content {
          flex: 1;
          padding: 2rem;
          margin-left: 250px;
          transition: all 0.3s ease;
        }
        
        .content-header {
          margin-bottom: 2rem;
        }
        
        .content-header h1 {
          font-size: 1.75rem;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0;
        }
        
        .subtitle {
          color: #6b7280;
          margin: 0.5rem 0 0;
          font-size: 0.875rem;
        }
        
        .card {
          background: #ffffff;
          border-radius: 0.75rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          border: 1px solid #e5e7eb;
          max-width: 800px;
          overflow: hidden;
        }
        
        .card-header {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .card-header h2 {
          font-size: 1.25rem;
          font-weight: 500;
          margin: 0;
          color: #1a1a1a;
        }
        
        .card-body {
          padding: 1.5rem;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-group label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
          color: #374151;
        }
        
        .form-control {
          width: 100%;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          transition: all 0.2s ease;
          background-color: #f9fafb;
        }
        
        .form-control:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          background-color: #ffffff;
        }
        
        .form-hint {
          display: block;
          margin-top: 0.5rem;
          font-size: 0.75rem;
          color: #6b7280;
        }
        
        .form-actions {
          margin-top: 2rem;
          display: flex;
          justify-content: flex-end;
        }
        
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.75rem 1.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }
        
        .btn-primary {
          background-color: #3b82f6;
          color: white;
        }
        
        .btn-primary:hover {
          background-color: #2563eb;
        }
        
        .btn-primary:disabled {
          background-color: #93c5fd;
          cursor: not-allowed;
        }
        
        .btn.loading {
          opacity: 0.8;
          cursor: progress;
        }
        
        .spinner {
          display: inline-block;
          width: 1rem;
          height: 1rem;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
          margin-right: 0.5rem;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .alert {
          padding: 1rem;
          border-radius: 0.5rem;
          margin-top: 1.5rem;
          display: flex;
          align-items: center;
          font-size: 0.875rem;
        }
        
        .alert-success {
          background-color: #ecfdf5;
          color: #065f46;
          border: 1px solid #a7f3d0;
        }
        
        .alert-error {
          background-color: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
        }
        
        .icon-check-circle,
        .icon-alert-circle {
          margin-right: 0.5rem;
          font-size: 1rem;
        }
        
        .icon-check-circle::before {
          content: "✓";
        }
        
        .icon-alert-circle::before {
          content: "⚠";
        }
      `}</style>
    </div>
  );
};

export default CreateBrand;