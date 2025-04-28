import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiEdit2, FiTrash2, FiUpload, FiX, FiCheck, FiArrowLeft } from "react-icons/fi";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

const BASE_URL = "http://localhost:5000";

const AdminEditVehicle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });

  const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid"];
  const accessoriesList = [
    "Air Conditioner", "Power Door Locks", "Anti-Lock Braking System",
    "Brake Assist", "Power Steering", "Passenger Airbag", "Power Windows",
    "CD Player", "Central Locking", "Crash Sensor", "Leather Seats"
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [vehicleRes, brandsRes] = await Promise.all([
          fetch(`${BASE_URL}/api/vehicles/${id}`),
          fetch(`${BASE_URL}/allbrands`)
        ]);

        const vehicleData = await vehicleRes.json();
        const brandsData = await brandsRes.json();

        if (!vehicleData) {
          throw new Error("Vehicle not found");
        }

        const images = vehicleData.images
          ? vehicleData.images.map((image) => ({
              preview: image.startsWith("http") ? image : `${BASE_URL}${image}`,
              file: null,
            }))
          : [];

        setVehicle({ ...vehicleData, images });
        setBrands(brandsData);
      } catch (error) {
        setMessage({ text: error.message, type: "error" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setVehicle({ ...vehicle, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newImages = files.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      setVehicle(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
    }
  };

  const handleRemoveImage = (index) => {
    setVehicle(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleAccessoryChange = (accessory) => {
    setVehicle(prev => ({
      ...prev,
      accessories: prev.accessories.includes(accessory)
        ? prev.accessories.filter(item => item !== accessory)
        : [...prev.accessories, accessory],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      
      // Append new image files
      vehicle.images.forEach(image => {
        if (image.file) formData.append("images", image.file);
      });

      // Append existing image paths
      formData.append("existingImages", JSON.stringify(
        vehicle.images.map(img => img.preview.replace(BASE_URL, ""))
      ));

      // Append other vehicle data
      Object.keys(vehicle).forEach(key => {
        if (key !== "images") {
          formData.append(key, key === "accessories" 
            ? JSON.stringify(vehicle[key]) 
            : vehicle[key] || "");
        }
      });

      const res = await fetch(`${BASE_URL}/api/vehicles/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to update vehicle");

      const data = await res.json();
      setMessage({ text: data.message || "Vehicle updated successfully!", type: "success" });
      setTimeout(() => navigate("/admin-managevehicle"), 1500);
    } catch (error) {
      setMessage({ text: error.message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin-managevehicles");
  };

  if (isLoading && !vehicle) {
    return (
      <div className="admin-edit-vehicle-loading">
        <AdminHeader />
        <AdminSidebar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading vehicle details...</p>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="admin-edit-vehicle-error">
        <AdminHeader />
        <AdminSidebar />
        <div className="error-container">
          <p>Vehicle not found or failed to load.</p>
          <button onClick={() => navigate("/admin-managevehicles")} className="back-button">
            <FiArrowLeft /> Back to Vehicles
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-edit-vehicle">
      <AdminHeader />
      <AdminSidebar />
      
      <main className="edit-vehicle-container">
        <div className="edit-vehicle-header">
          <h1>
            <FiEdit2 /> Edit Vehicle: {vehicle.title}
          </h1>
          <button onClick={handleCancel} className="cancel-button">
            <FiX /> Cancel
          </button>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.type === "success" ? <FiCheck /> : <FiX />}
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="edit-vehicle-form">
          <div className="form-section">
            <h2>Basic Information</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Vehicle Title</label>
                <input 
                  type="text" 
                  name="title" 
                  value={vehicle.title} 
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Brand</label>
                <select name="brand" value={vehicle.brand} onChange={handleChange} required>
                  <option value="">Select Brand</option>
                  {brands.map(brand => (
                    <option key={brand._id} value={brand.name}>{brand.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Price Per Day ($)</label>
                <input 
                  type="number" 
                  name="pricePerDay" 
                  value={vehicle.pricePerDay} 
                  onChange={handleChange} 
                  required 
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>Model Year</label>
                <input 
                  type="number" 
                  name="modelYear" 
                  value={vehicle.modelYear} 
                  onChange={handleChange} 
                  required 
                  min="1900" 
                  max={new Date().getFullYear() + 1}
                />
              </div>

              <div className="form-group">
                <label>Seating Capacity</label>
                <input 
                  type="number" 
                  name="seatingCapacity" 
                  value={vehicle.seatingCapacity} 
                  onChange={handleChange} 
                  required 
                  min="1" 
                  max="20"
                />
              </div>

              <div className="form-group">
                <label>Fuel Type</label>
                <select name="fuelType" value={vehicle.fuelType} onChange={handleChange} required>
                  <option value="">Select Fuel Type</option>
                  {fuelTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Vehicle Overview</h2>
            <textarea 
              name="overview" 
              value={vehicle.overview} 
              onChange={handleChange} 
              required 
              rows="5"
            />
          </div>

          <div className="form-section">
            <h2>Images</h2>
            <div className="image-upload-container">
              <div className="image-preview-grid">
                {vehicle.images.map((image, index) => (
                  <div key={index} className="image-preview">
                    <img src={image.preview} alt={`Vehicle ${index + 1}`} />
                    <button 
                      type="button" 
                      onClick={() => handleRemoveImage(index)}
                      className="remove-image-button"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="upload-area">
                <label className="upload-label">
                  <FiUpload className="upload-icon" />
                  <span>Click to upload or drag & drop</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    multiple
                    className="file-input"
                  />
                </label>
                <p className="upload-hint">PNG, JPG up to 5MB</p>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Accessories</h2>
            <div className="accessories-grid">
              {accessoriesList.map(accessory => (
                <label key={accessory} className="accessory-option">
                  <input
                    type="checkbox"
                    checked={vehicle.accessories.includes(accessory)}
                    onChange={() => handleAccessoryChange(accessory)}
                  />
                  <span className="checkmark"></span>
                  {accessory}
                </label>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Vehicle"}
            </button>
            <button 
              type="button" 
              onClick={handleCancel}
              className="cancel-button"
            >
              Cancel
            </button>
          </div>
        </form>
      </main>

      <style jsx>{`
        .admin-edit-vehicle {
          display: flex;
          min-height: 100vh;
          background-color: #f8fafc;
          font-family: 'Inter', sans-serif;
        }

        .edit-vehicle-container {
          flex: 1;
          padding: 2rem;
          margin-left: 280px;
          max-width: 1200px;
        }

        .edit-vehicle-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .edit-vehicle-header h1 {
          font-size: 1.75rem;
          color: #1e293b;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .cancel-button {
          background: #f8fafc;
          color: #64748b;
          border: 1px solid #e2e8f0;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .cancel-button:hover {
          background: #f1f5f9;
        }

        .message {
          padding: 1rem;
          border-radius: 6px;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
        }

        .message.success {
          background: #ecfdf5;
          color: #059669;
          border: 1px solid #a7f3d0;
        }

        .message.error {
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
        }

        .edit-vehicle-form {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .form-section {
          margin-bottom: 2rem;
        }

        .form-section h2 {
          font-size: 1.25rem;
          color: #1e293b;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #475569;
        }

        input, select, textarea {
          padding: 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          background: #f8fafc;
          font-size: 0.95rem;
          transition: all 0.2s;
        }

        input:focus, select:focus, textarea:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
          background: white;
        }

        textarea {
          width: 100%;
          resize: vertical;
          min-height: 120px;
        }

        .image-upload-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .image-preview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 1rem;
        }

        .image-preview {
          position: relative;
          height: 150px;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .image-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .remove-image-button {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background: rgba(239, 68, 68, 0.9);
          color: white;
          border: none;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .remove-image-button:hover {
          background: #dc2626;
        }

        .upload-area {
          border: 2px dashed #cbd5e1;
          border-radius: 8px;
          padding: 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .upload-area:hover {
          border-color: #6366f1;
          background: #f8fafc;
        }

        .upload-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
        }

        .upload-icon {
          font-size: 1.5rem;
          color: #64748b;
        }

        .file-input {
          display: none;
        }

        .upload-hint {
          font-size: 0.875rem;
          color: #64748b;
          margin-top: 0.5rem;
        }

        .accessories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 0.75rem;
        }

        .accessory-option {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          position: relative;
          padding-left: 1.75rem;
          cursor: pointer;
          user-select: none;
        }

        .accessory-option input {
          position: absolute;
          opacity: 0;
          cursor: pointer;
          height: 0;
          width: 0;
        }

        .checkmark {
          position: absolute;
          top: 0;
          left: 0;
          height: 1.25rem;
          width: 1.25rem;
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
        }

        .accessory-option:hover input ~ .checkmark {
          background-color: #f1f5f9;
        }

        .accessory-option input:checked ~ .checkmark {
          background-color: #6366f1;
          border-color: #6366f1;
        }

        .checkmark:after {
          content: "";
          position: absolute;
          display: none;
        }

        .accessory-option input:checked ~ .checkmark:after {
          display: block;
        }

        .accessory-option .checkmark:after {
          left: 7px;
          top: 3px;
          width: 5px;
          height: 10px;
          border: solid white;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e2e8f0;
        }

        .submit-button {
          background: #6366f1;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .submit-button:hover {
          background: #4f46e5;
        }

        .submit-button:disabled {
          background: #cbd5e1;
          cursor: not-allowed;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 60vh;
          gap: 1rem;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #e2e8f0;
          border-top: 4px solid #6366f1;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 60vh;
          gap: 1rem;
        }

        .back-button {
          background: #6366f1;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        @media (max-width: 768px) {
          .edit-vehicle-container {
            margin-left: 0;
            padding: 1rem;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .image-preview-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .accessories-grid {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminEditVehicle;