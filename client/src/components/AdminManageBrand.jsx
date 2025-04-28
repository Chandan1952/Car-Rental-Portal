import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import { FiEdit2, FiTrash2, FiSave, FiPlus, FiSearch } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManageBrands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [newBrand, setNewBrand] = useState("");

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("https://car-rental-portal-backend.onrender.com/allbrands");
      setBrands(response.data);
    } catch (error) {
      setError("Failed to fetch brands.");
      toast.error("Failed to fetch brands");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this brand?")) return;

    try {
      await axios.delete(`https://car-rental-portal-backend.onrender.com/api/brands/${id}`);
      setBrands(brands.filter((brand) => brand._id !== id));
      toast.success("Brand deleted successfully");
    } catch (error) {
      toast.error("Failed to delete brand");
    }
  };

  const handleEdit = (brand) => {
    setEditId(brand._id);
    setEditName(brand.name);
  };

  const handleUpdate = async (id) => {
    if (!editName.trim()) {
      toast.warning("Brand name cannot be empty!");
      return;
    }

    try {
      await axios.put(`https://car-rental-portal-backend.onrender.com/api/brands/${id}`, { name: editName });
      setBrands(brands.map((brand) => (brand._id === id ? { ...brand, name: editName } : brand)));
      setEditId(null);
      toast.success("Brand updated successfully");
    } catch (error) {
      toast.error("Failed to update brand");
    }
  };

  const handleAddBrand = async () => {
    if (!newBrand.trim()) {
      toast.warning("Brand name cannot be empty!");
      return;
    }

    try {
      const response = await axios.post("https://car-rental-portal-backend.onrender.com/api/brands", { name: newBrand });
      setBrands([...brands, response.data]);
      setNewBrand("");
      toast.success("Brand added successfully");
    } catch (error) {
      toast.error("Failed to add brand");
    }
  };

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-container">
      <ToastContainer position="top-right" autoClose={3000} />

      <AdminHeader />

      <div className="admin-main-container">
        <AdminSidebar />

        <div className="admin-content">
          <div className="content-header">
            <h2>Manage Brands</h2>
            <div className="header-actions">
              <div className="search-box">
                <FiSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search brands..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="add-brand">
                <input
                  type="text"
                  placeholder="New brand name"
                  value={newBrand}
                  onChange={(e) => setNewBrand(e.target.value)}
                />
                <button className="btn-add" onClick={handleAddBrand}>
                  <FiPlus /> Add Brand
                </button>
              </div>
            </div>
          </div>

          <div className="brand-table-container">
            {loading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Loading brands...</p>
              </div>
            ) : error ? (
              <div className="error-message">
                <p>{error}</p>
              </div>
            ) : (
              <div className="brand-table">
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Brand Name</th>
                      <th>Created</th>
                      <th>Updated</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBrands.length > 0 ? (
                      filteredBrands.map((brand, index) => (
                        <tr key={brand._id}>
                          <td>{index + 1}</td>
                          <td>
                            {editId === brand._id ? (
                              <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="edit-input"
                                autoFocus
                              />
                            ) : (
                              <span className="brand-name">{brand.name}</span>
                            )}
                          </td>
                          <td>
                            {brand.createdAt
                              ? new Date(brand.createdAt).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td>
                            {brand.updatedAt
                              ? new Date(brand.updatedAt).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td className="actions">
                            {editId === brand._id ? (
                              <button
                                className="btn-save"
                                onClick={() => handleUpdate(brand._id)}
                              >
                                <FiSave /> Save
                              </button>
                            ) : (
                              <button
                                className="btn-edit"
                                onClick={() => handleEdit(brand)}
                              >
                                <FiEdit2 /> Edit
                              </button>
                            )}
                            <button
                              className="btn-delete"
                              onClick={() => handleDelete(brand._id)}
                            >
                              <FiTrash2 /> Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="no-data">
                          {searchTerm ? "No matching brands found" : "No brands found"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-container {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background-color: #f8fafc;
        }

        .admin-main-container {
          display: flex;
          flex: 1;
        }

        .admin-content {
          flex-grow: 1;
          padding: 2rem;
          background-color: #f8fafc;
             margin-left: 260px;
        }

        .content-header {
          display: flex;
          flex-direction: column;
          margin-bottom: 2rem;
        }

        .content-header h2 {
          font-size: 1.75rem;
          color: #1e293b;
          margin-bottom: 1.5rem;
          font-weight: 600;
        }

        .header-actions {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .search-box {
          position: relative;
          flex: 1;
          max-width: 400px;
        }

        .search-box input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          background-color: white;
        }

        .search-box input:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }

        .add-brand {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .add-brand input {
          padding: 0.75rem 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          font-size: 0.9rem;
          min-width: 200px;
          transition: all 0.3s ease;
        }

        .add-brand input:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
        }

        .brand-table-container {
          background: white;
          border-radius: 0.75rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .brand-table {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          min-width: 800px;
        }

        table th {
          background-color: #f1f5f9;
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          color: #475569;
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 0.05em;
        }

        table td {
          padding: 1rem;
          border-top: 1px solid #e2e8f0;
          color: #334155;
        }

        table tr:hover {
          background-color: #f8fafc;
        }

        .brand-name {
          font-weight: 500;
          color: #1e293b;
        }

        .edit-input {
          padding: 0.5rem 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.375rem;
          width: 100%;
          max-width: 300px;
          font-size: 0.9rem;
        }

        .edit-input:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
        }

        .actions {
          display: flex;
          gap: 0.5rem;
        }

        button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }

        .btn-add {
          background-color: #6366f1;
          color: white;
        }

        .btn-add:hover {
          background-color: #4f46e5;
        }

        .btn-edit {
          background-color: #f59e0b;
          color: white;
        }

        .btn-edit:hover {
          background-color: #d97706;
        }

        .btn-save {
          background-color: #10b981;
          color: white;
        }

        .btn-save:hover {
          background-color: #059669;
        }

        .btn-delete {
          background-color: #ef4444;
          color: white;
        }

        .btn-delete:hover {
          background-color: #dc2626;
        }

        .no-data {
          text-align: center;
          color: #64748b;
          padding: 2rem;
        }

        .loading-spinner {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          gap: 1rem;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #e2e8f0;
          border-top-color: #6366f1;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .error-message {
          padding: 2rem;
          text-align: center;
          color: #ef4444;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .header-actions {
            flex-direction: column;
          }
          
          .search-box {
            max-width: 100%;
          }
          
          .add-brand {
            width: 100%;
          }
          
          .add-brand input {
            flex: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default ManageBrands;
