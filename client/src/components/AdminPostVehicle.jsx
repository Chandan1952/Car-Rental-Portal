import React, { useState, useEffect } from "react";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import { FiUpload, FiX, FiCheck, FiPlus, FiSave } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminPostVehicle = () => {
  const [formData, setFormData] = useState({
    vehicleTitle: "",
    vehicleOverview: "",
    pricePerDay: "",
    modelYear: "",
    seatingCapacity: "",
    brand: "",
    fuelType: "",
    images: [],
    accessories: [],
  });

  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid"];
  const accessoriesList = [
    "Air Conditioner",
    "Power Door Locks",
    "Anti-Lock Braking",
    "Brake Assist",
    "Power Steering",
    "Passenger Airbag",
    "Power Windows",
    "Entertainment System",
    "Central Locking",
    "Crash Sensor",
    "Leather Seats",
  ];

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch("http://localhost:5000/allbrands");
        const data = await response.json();
        setBrands(data);
      } catch (error) {
        toast.error("Failed to load brands");
        console.error("Error fetching brands:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBrands();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + formData.images.length > 5) {
      toast.warning("Maximum 5 images allowed");
      return;
    }
    setFormData({
      ...formData,
      images: [...formData.images, ...files.slice(0, 5 - formData.images.length)],
    });
  };

  const removeImage = (index) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
  };

  const handleAccessoryChange = (accessory) => {
    setFormData((prev) => ({
      ...prev,
      accessories: prev.accessories.includes(accessory)
        ? prev.accessories.filter((item) => item !== accessory)
        : [...prev.accessories, accessory],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.vehicleTitle);
    formDataToSend.append("overview", formData.vehicleOverview);
    formDataToSend.append("brand", formData.brand);
    formDataToSend.append("fuelType", formData.fuelType);
    formDataToSend.append("pricePerDay", formData.pricePerDay);
    formDataToSend.append("modelYear", formData.modelYear);
    formDataToSend.append("seatingCapacity", formData.seatingCapacity);
    formDataToSend.append("accessories", JSON.stringify(formData.accessories));
    formData.images.forEach((file) => formDataToSend.append("images", file));

    try {
      const response = await fetch("http://localhost:5000/api/vehicles", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Vehicle posted successfully!");
        // Reset form
        setFormData({
          vehicleTitle: "",
          vehicleOverview: "",
          pricePerDay: "",
          modelYear: "",
          seatingCapacity: "",
          brand: "",
          fuelType: "",
          images: [],
          accessories: [],
        });
      } else {
        throw new Error(data.message || "Failed to post vehicle");
      }
    } catch (error) {
      toast.error(error.message);
      console.error("Error saving vehicle:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-layout">
      <AdminHeader />
      <AdminSidebar />
      
      <main className="admin-content">
        <div className="vehicle-form-container">
          <div className="form-header">
            <h1>Post New Vehicle</h1>
            <p>Fill in the details to add a new vehicle to your fleet</p>
          </div>

          <form onSubmit={handleSubmit} className="vehicle-form">
            <div className="form-grid">
              {/* Vehicle Basic Info */}
              <div className="form-section">
                <h2 className="section-title">Basic Information</h2>
                <div className="form-group">
                  <label>Vehicle Title *</label>
                  <input
                    type="text"
                    name="vehicleTitle"
                    value={formData.vehicleTitle}
                    onChange={handleInputChange}
                    placeholder="e.g. Toyota Camry 2022"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Select Brand *</label>
                  <select
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  >
                    <option value="">Select Brand</option>
                    {brands.map((brand) => (
                      <option key={brand._id} value={brand.name}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                  {isLoading && <div className="loading-indicator">Loading brands...</div>}
                </div>

                <div className="form-group">
                  <label>Vehicle Overview *</label>
                  <textarea
                    name="vehicleOverview"
                    value={formData.vehicleOverview}
                    onChange={handleInputChange}
                    placeholder="Describe the vehicle features, condition, and specifications"
                    rows="4"
                    required
                  />
                </div>
              </div>

              {/* Vehicle Specifications */}
              <div className="form-section">
                <h2 className="section-title">Specifications</h2>
                <div className="form-row">
                  <div className="form-group">
                    <label>Price Per Day (₹) *</label>
                    <div className="input-with-symbol">
                      <span>₹</span>
                      <input
                        type="number"
                        name="pricePerDay"
                        value={formData.pricePerDay}
                        onChange={handleInputChange}
                        placeholder="1500"
                        min="0"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Model Year *</label>
                    <input
                      type="number"
                      name="modelYear"
                      value={formData.modelYear}
                      onChange={handleInputChange}
                      placeholder="2022"
                      min="1900"
                      max={new Date().getFullYear() + 1}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Fuel Type *</label>
                    <select
                      name="fuelType"
                      value={formData.fuelType}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Fuel Type</option>
                      {fuelTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Seating Capacity *</label>
                    <input
                      type="number"
                      name="seatingCapacity"
                      value={formData.seatingCapacity}
                      onChange={handleInputChange}
                      placeholder="5"
                      min="1"
                      max="20"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Images */}
            <div className="form-section">
              <h2 className="section-title">Vehicle Images</h2>
              <p className="section-description">Upload high-quality images (max 5)</p>
              
              <div className="image-upload-container">
                <label className="upload-area">
                  <FiUpload className="upload-icon" />
                  <span>Click to upload images</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    multiple
                    className="file-input"
                  />
                </label>
                
                <div className="image-previews">
                  {formData.images.map((image, index) => (
                    <div key={index} className="image-preview">
                      <img src={URL.createObjectURL(image)} alt={`Preview ${index + 1}`} />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="remove-image-btn"
                      >
                        <FiX />
                      </button>
                    </div>
                  ))}
                  
                  {Array(5 - formData.images.length).fill().map((_, index) => (
                    <div key={`empty-${index}`} className="empty-slot">
                      <FiPlus />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Accessories */}
            <div className="form-section">
              <h2 className="section-title">Accessories & Features</h2>
              <p className="section-description">Select all that apply</p>
              
              <div className="accessories-grid">
                {accessoriesList.map((accessory) => (
                  <label key={accessory} className="accessory-item">
                    <input
                      type="checkbox"
                      checked={formData.accessories.includes(accessory)}
                      onChange={() => handleAccessoryChange(accessory)}
                    />
                    <span className="custom-checkbox">
                      {formData.accessories.includes(accessory) && <FiCheck />}
                    </span>
                    {accessory}
                  </label>
                ))}
              </div>
            </div>

            {/* Form Actions */}
            <div className="form-actions">
              <button type="button" className="cancel-btn">
                Cancel
              </button>
              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="spinner"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <FiSave />
                    Post Vehicle
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

      <ToastContainer position="top-right" autoClose={3000} />
      
      <style jsx>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
          background-color: #f8fafc;
        }
        
        .admin-content {
          flex: 1;
          margin-left: 260px;
          padding: 2rem;
          margin-top: 80px;
        }
        
        .vehicle-form-container {
          max-width: 1000px;
          margin: 0 auto;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }
        
        .form-header {
          padding: 1.5rem 2rem;
          border-bottom: 1px solid #f1f5f9;
        }
        
        .form-header h1 {
          font-size: 1.75rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }
        
        .form-header p {
          color: #64748b;
          margin: 0.5rem 0 0;
          font-size: 0.95rem;
        }
        
        .vehicle-form {
          padding: 0 2rem 2rem;
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 1.5rem;
        }
        
        .form-section {
          margin-bottom: 2rem;
        }
        
        .section-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 1rem;
        }
        
        .section-description {
          color: #64748b;
          font-size: 0.875rem;
          margin: -0.5rem 0 1rem;
        }
        
        .form-group {
          margin-bottom: 1.25rem;
        }
        
        .form-group label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: #334155;
          margin-bottom: 0.5rem;
        }
        
        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.95rem;
          transition: all 0.2s ease;
          background-color: #f8fafc;
        }
        
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
          background-color: #fff;
        }
        
        .form-group textarea {
          resize: vertical;
          min-height: 100px;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        
        .input-with-symbol {
          position: relative;
        }
        
        .input-with-symbol span {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
          font-weight: 500;
        }
        
        .input-with-symbol input {
          padding-left: 30px !important;
        }
        
        .loading-indicator {
          font-size: 0.8rem;
          color: #64748b;
          margin-top: 0.5rem;
        }
        
        .image-upload-container {
          margin-top: 1rem;
        }
        
        .upload-area {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          border: 2px dashed #e2e8f0;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-bottom: 1rem;
          background-color: #f8fafc;
        }
        
        .upload-area:hover {
          border-color: #6366f1;
          background-color: #f0f4ff;
        }
        
        .upload-icon {
          font-size: 1.5rem;
          color: #6366f1;
          margin-bottom: 0.5rem;
        }
        
        .upload-area span {
          color: #64748b;
          font-size: 0.9rem;
        }
        
        .file-input {
          display: none;
        }
        
        .image-previews {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1rem;
        }
        
        .image-preview {
          position: relative;
          aspect-ratio: 4/3;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #e2e8f0;
        }
        
        .image-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .remove-image-btn {
          position: absolute;
          top: 5px;
          right: 5px;
          width: 24px;
          height: 24px;
          background: rgba(0, 0, 0, 0.6);
          color: white;
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          padding: 0;
        }
        
        .empty-slot {
          aspect-ratio: 4/3;
          border: 2px dashed #e2e8f0;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
          background-color: #f8fafc;
        }
        
        .accessories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 0.75rem;
        }
        
        .accessory-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          color: #334155;
          cursor: pointer;
        }
        
        .accessory-item input {
          display: none;
        }
        
        .custom-checkbox {
          width: 18px;
          height: 18px;
          border: 2px solid #cbd5e1;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }
        
        .accessory-item input:checked + .custom-checkbox {
          background-color: #6366f1;
          border-color: #6366f1;
          color: white;
        }
        
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid #f1f5f9;
        }
        
        .cancel-btn {
          padding: 0.75rem 1.5rem;
          background: #f1f5f9;
          color: #64748b;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .cancel-btn:hover {
          background: #e2e8f0;
        }
        
        .submit-btn {
          padding: 0.75rem 1.5rem;
          background: #6366f1;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .submit-btn:hover {
          background: #4f46e5;
        }
        
        .submit-btn:disabled {
          background: #a5b4fc;
          cursor: not-allowed;
        }
        
        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AdminPostVehicle;