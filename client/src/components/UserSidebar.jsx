import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  FaUser, FaLock, FaSignOutAlt, FaCar, 
  FaComment, FaChevronDown, FaChevronRight 
} from "react-icons/fa";
import { motion } from "framer-motion";

const UserSidebar = () => {
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState({
    profile: true,
    bookings: true,
    feedback: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const navGroups = [
    {
      title: "Profile",
      icon: <FaUser className="text-indigo-500" />,
      items: [
        { 
          to: "/profile-settings", 
          label: "Profile Settings",
          icon: <FaUser className="text-gray-500" />
        },
        { 
          to: "/update-password", 
          label: "Security",
          icon: <FaLock className="text-gray-500" />
        }
      ]
    },
    {
      title: "Bookings",
      icon: <FaCar className="text-blue-500" />,
      items: [
        { 
          to: "/my-booking", 
          label: "My Bookings",
          icon: <FaCar className="text-gray-500" />,
          badge: 3
        }
      ]
    },
    {
      title: "Feedback",
      icon: <FaComment className="text-green-500" />,
      items: [
        { 
          to: "/post-testimonial", 
          label: "Share Feedback",
          icon: <FaComment className="text-gray-500" />
        },
        { 
          to: "/my-testimonial", 
          label: "My Feedback",
          icon: <FaUser className="text-gray-500" />
        }
      ]
    },
    {
      title: "Account",
      items: [
        { 
          to: "/logout", 
          label: "Sign Out", 
          icon: <FaSignOutAlt className="text-red-500" />,
          isSignOut: true 
        }
      ]
    }
  ];

  return (
    <div className="sidebar-container">
      {/* User Profile Section */}
      <div className="user-profile">
        <div className="avatar">
          <FaUser size={24} className="text-white" />
        </div>
        <div className="user-info">
          <h3>John Doe</h3>
          <p>Premium Member</p>
        </div>
      </div>

      {/* Navigation Groups */}
      <nav className="sidebar-nav">
        {navGroups.map((group, index) => (
          <div key={index} className="nav-group">
            {group.title && (
              <div 
                className="group-header"
                onClick={() => group.items.length > 1 ? toggleSection(group.title.toLowerCase()) : null}
              >
                <div className="flex items-center">
                  {group.icon && <span className="group-icon">{group.icon}</span>}
                  <span className="group-title">{group.title}</span>
                </div>
                {group.items.length > 1 && (
                  expandedSections[group.title.toLowerCase()] ? 
                    <FaChevronDown className="text-gray-400 text-xs" /> : 
                    <FaChevronRight className="text-gray-400 text-xs" />
                )}
              </div>
            )}
            
            {(group.items.length <= 1 || expandedSections[group.title.toLowerCase()]) && (
              <ul className="nav-items">
                {group.items.map((item, itemIndex) => (
                  <motion.li 
                    key={itemIndex}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link 
                      to={item.to} 
                      className={`nav-item ${location.pathname === item.to ? 'active' : ''} ${item.isSignOut ? 'sign-out' : ''}`}
                    >
                      <span className="item-icon">{item.icon}</span>
                      <span className="item-label">{item.label}</span>
                      {item.badge && (
                        <span className="badge">{item.badge}</span>
                      )}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </nav>

      {/* Styles */}
      <style jsx>{`
        .sidebar-container {
          width: 280px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          display: flex;
          flex-direction: column;
          height: calc(100vh - 40px);
          overflow: hidden;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .user-profile {
          padding: 24px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
          color: white;
        }

        .avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-info h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }

        .user-info p {
          margin: 4px 0 0;
          font-size: 12px;
          opacity: 0.8;
        }

        .sidebar-nav {
          flex: 1;
          padding: 16px 0;
          overflow-y: auto;
        }

        .nav-group {
          margin-bottom: 8px;
        }

        .group-header {
          padding: 12px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          user-select: none;
        }

        .group-icon {
          margin-right: 12px;
        }

        .group-title {
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #64748b;
        }

        .nav-items {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .nav-item {
          display: flex;
          align-items: center;
          padding: 12px 20px;
          text-decoration: none;
          color: #334155;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
          position: relative;
        }

        .nav-item:hover {
          background-color: #f8fafc;
        }

        .nav-item.active {
          background-color: #f1f5ff;
          color: #4f46e5;
        }

        .nav-item.active .item-icon {
          color: #4f46e5;
        }

        .item-icon {
          margin-right: 12px;
          width: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .item-label {
          flex: 1;
        }

        .badge {
          background-color: #ef4444;
          color: white;
          font-size: 11px;
          padding: 2px 6px;
          border-radius: 999px;
          margin-left: 8px;
        }

        .sign-out {
          color: #ef4444;
        }

        .sign-out .item-icon {
          color: #ef4444;
        }

        .sign-out:hover {
          background-color: #fee2e2;
        }

        /* Scrollbar styling */
        .sidebar-nav::-webkit-scrollbar {
          width: 6px;
        }

        .sidebar-nav::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .sidebar-nav::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }

        .sidebar-nav::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
    </div>
  );
};

export default UserSidebar;