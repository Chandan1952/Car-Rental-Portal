import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaCar,
  FaBook,
  FaUsers,
  FaRegFileAlt,
  FaClipboardList,
  FaCog,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { RiCarFill } from "react-icons/ri";
import { HiOutlineUserGroup, HiOutlineMail } from "react-icons/hi";
import { FiSettings } from "react-icons/fi";
import { BsFileText, BsBookmarkCheck } from "react-icons/bs";

const AdminSidebar = () => {
  const location = useLocation();
  const [openDropdowns, setOpenDropdowns] = useState({
    brands: location.pathname.includes("brand"),
    vehicles: location.pathname.includes("vehicle"),
  });

  const toggleDropdown = (dropdown) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [dropdown]: !prev[dropdown]
    }));
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Car Rental Portal</h2>
        <div className="sidebar-subtitle">Admin Dashboard</div>
      </div>

      <div className="sidebar-menu">
        <NavLink 
          to="/admin-dashboard" 
          className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
        >
          <FaTachometerAlt className="menu-icon" />
          <span className="menu-text">Dashboard</span>
        </NavLink>

        {/* Brands Dropdown */}
        <div className="dropdown-container">
          <div 
            className={`menu-item ${openDropdowns.brands ? 'dropdown-open' : ''}`}
            onClick={() => toggleDropdown('brands')}
          >
            <RiCarFill className="menu-icon" />
            <span className="menu-text">Brands</span>
            {openDropdowns.brands ? (
              <FaChevronUp className="dropdown-arrow" />
            ) : (
              <FaChevronDown className="dropdown-arrow" />
            )}
          </div>
          
          {openDropdowns.brands && (
            <div className="dropdown-menu">
              <NavLink 
                to="/admin-createbrands" 
                className={({ isActive }) => `dropdown-item ${isActive ? 'active' : ''}`}
              >
                Create Brands
              </NavLink>
              <NavLink 
                to="/admin-managebrands" 
                className={({ isActive }) => `dropdown-item ${isActive ? 'active' : ''}`}
              >
                Manage Brands
              </NavLink>
            </div>
          )}
        </div>

        {/* Vehicles Dropdown */}
        <div className="dropdown-container">
          <div 
            className={`menu-item ${openDropdowns.vehicles ? 'dropdown-open' : ''}`}
            onClick={() => toggleDropdown('vehicles')}
          >
            <FaCar className="menu-icon" />
            <span className="menu-text">Vehicles</span>
            {openDropdowns.vehicles ? (
              <FaChevronUp className="dropdown-arrow" />
            ) : (
              <FaChevronDown className="dropdown-arrow" />
            )}
          </div>
          
          {openDropdowns.vehicles && (
            <div className="dropdown-menu">
              <NavLink 
                to="/admin-postvehicle" 
                className={({ isActive }) => `dropdown-item ${isActive ? 'active' : ''}`}
              >
                Post a Vehicle
              </NavLink>
              <NavLink 
                to="/admin-managevehicle" 
                className={({ isActive }) => `dropdown-item ${isActive ? 'active' : ''}`}
              >
                Manage Vehicles
              </NavLink>
            </div>
          )}
        </div>

        <NavLink 
          to="/admin-managebookings" 
          className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
        >
          <BsBookmarkCheck className="menu-icon" />
          <span className="menu-text">Manage Bookings</span>
        </NavLink>

        <NavLink 
          to="/admin-managetestimonials" 
          className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
        >
          <FaClipboardList className="menu-icon" />
          <span className="menu-text">Testimonials</span>
        </NavLink>

        <NavLink 
          to="/admin-managequery" 
          className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
        >
          <HiOutlineMail className="menu-icon" />
          <span className="menu-text">Contact Queries</span>
        </NavLink>

        <NavLink 
          to="/admin-manageusers" 
          className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
        >
          <HiOutlineUserGroup className="menu-icon" />
          <span className="menu-text">Users</span>
        </NavLink>

        <NavLink 
          to="/admin-managefaqs" 
          className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
        >
          <BsFileText className="menu-icon" />
          <span className="menu-text">FAQs</span>
        </NavLink>

        <NavLink 
          to="/admin-updatedcontactinfo" 
          className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
        >
          <FiSettings className="menu-icon" />
          <span className="menu-text">Contact Info</span>
        </NavLink>

        <NavLink 
          to="/admin-managesubscriptions" 
          className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
        >
          <FaUsers className="menu-icon" />
          <span className="menu-text">Subscribers</span>
        </NavLink>
      </div>

      <style jsx>{`
        .sidebar {
          width: 260px;
          height: 100vh;
          background: linear-gradient(180deg, #2c3e50 0%, #1a252f 100%);
          color: #fff;
          display: flex;
          flex-direction: column;
          position: fixed;
          left: 0;
          top: 0;
          box-shadow: 4px 0 15px rgba(0, 0, 0, 0.1);
          z-index: 100;
          transition: all 0.3s ease;
        }

        .sidebar-header {
          padding: 1.5rem 1.5rem 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .sidebar-header h2 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0;
          color: #fff;
        }

        .sidebar-subtitle {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.7);
          margin-top: 0.25rem;
        }

        .sidebar-menu {
          padding: 1rem 0;
          flex: 1;
          overflow-y: auto;
        }

        .menu-item {
          display: flex;
          align-items: center;
          padding: 0.8rem 1.5rem;
          margin: 0.25rem 0;
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          transition: all 0.2s ease;
          cursor: pointer;
          position: relative;
        }

        .menu-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
        }

        .menu-item.active {
          background: rgba(59, 130, 246, 0.2);
          color: #fff;
          border-left: 3px solid #3b82f6;
        }

        .menu-item.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 3px;
          background: #3b82f6;
        }

        .menu-icon {
          font-size: 1rem;
          margin-right: 1rem;
          min-width: 20px;
        }

        .menu-text {
          font-size: 0.9rem;
          font-weight: 500;
          flex: 1;
        }

        .dropdown-container {
          margin-bottom: 0.25rem;
        }

        .dropdown-open {
          background: rgba(255, 255, 255, 0.05);
        }

        .dropdown-arrow {
          font-size: 0.8rem;
          transition: transform 0.2s ease;
        }

        .dropdown-menu {
          padding-left: 2.5rem;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .dropdown-item {
          display: block;
          padding: 0.6rem 1rem;
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          font-size: 0.85rem;
          transition: all 0.2s ease;
          border-radius: 4px;
          margin: 0.15rem 0;
        }

        .dropdown-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
        }

        .dropdown-item.active {
          background: rgba(59, 130, 246, 0.15);
          color: #3b82f6;
          font-weight: 500;
        }

        /* Scrollbar styling */
        .sidebar-menu::-webkit-scrollbar {
          width: 6px;
        }

        .sidebar-menu::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }

        .sidebar-menu::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }

        .sidebar-menu::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
};

export default AdminSidebar;