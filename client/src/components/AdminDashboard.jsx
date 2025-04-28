import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import axios from "axios";
import { 
  FiUsers, FiTruck, FiCalendar, FiTag, FiMail, FiMessageSquare, FiStar 
} from "react-icons/fi";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const BASE_URL = "https://car-rental-portal-backend.onrender.com";

const DashboardCard = ({ title, count, color, icon: Icon }) => {
  return (
    <div style={{ 
      ...styles.card, 
      borderLeft: `4px solid ${color}`,
      background: "linear-gradient(to right, #ffffff, #f9f9f9)"
    }}>
      <div style={styles.cardInner}>
        <div style={{ 
          backgroundColor: `${color}20`, 
          width: "48px", 
          height: "48px",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "16px"
        }}>
          <Icon size={24} color={color} />
        </div>
        <h3 style={{ ...styles.cardCount, color }}>{count}</h3>
        <p style={styles.cardTitle}>{title}</p>
      </div>
    </div>
  );
};

const DashboardChart = ({ data }) => {
  return (
    <div style={styles.chartContainer}>
      <h3 style={styles.chartTitle}>Monthly Bookings Overview</h3>
      <div style={{ height: "300px", marginTop: "20px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              contentStyle={{ 
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
              }}
            />
            <Legend />
            <Bar 
              dataKey="bookings" 
              fill="#4F46E5" 
              radius={[4, 4, 0, 0]}
              name="Bookings"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const Dashboard = ({ stats, loading, error, chartData }) => {
  if (loading) return (
    <div style={styles.loadingContainer}>
      <div style={styles.loadingSpinner}></div>
      <p style={styles.loadingText}>Loading dashboard data...</p>
    </div>
  );
  
  if (error) return (
    <div style={styles.errorContainer}>
      <p style={styles.errorMessage}>{error}</p>
      <button 
        style={styles.retryButton}
        onClick={() => window.location.reload()}
      >
        Retry
      </button>
    </div>
  );

  return (
    <div style={styles.dashboardContent}>
      <div style={styles.welcomeBanner}>
        <h1 style={styles.welcomeTitle}>Dashboard Overview</h1>
        <p style={styles.welcomeText}>
          Welcome back! Here's what's happening with your platform today.
        </p>
      </div>

      <div style={styles.gridContainer}>
        {stats.map((stat, index) => (
          <DashboardCard key={index} {...stat} />
        ))}
      </div>

      <DashboardChart data={chartData} />

      <div style={styles.recentActivity}>
        <h3 style={styles.sectionTitle}>Recent Activity</h3>
        <div style={styles.activityList}>
          {[1, 2, 3, 4].map((item) => (
            <div key={item} style={styles.activityItem}>
              <div style={styles.activityDot}></div>
              <div>
                <p style={styles.activityText}>
                  New booking #B00{item} received for Toyota Camry
                </p>
                <p style={styles.activityTime}>2 hours ago</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

function AdminDashboard() {
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [chartData, setChartData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAdminSession = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/admin-verify`, {
          withCredentials: true,
        });
        if (response.data.isAdmin) {
          setAdmin({ 
            email: response.data.email,
            name: response.data.name || "Admin"
          });
        } else {
          navigate("/admin-login");
        }
      } catch {
        navigate("/admin-login");
      }
    };

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsResponse, chartResponse] = await Promise.all([
          axios.get(`${BASE_URL}/admin-dashboard`, { withCredentials: true }),
          axios.get(`${BASE_URL}/booking-stats`, { withCredentials: true })
        ]);

        const fetchedStats = statsResponse.data.stats || {};
        const formattedStats = [
          { 
            title: "Registered Users", 
            count: fetchedStats.regUsers || 0, 
            color: "#4F46E5",
            icon: FiUsers
          },
          { 
            title: "Listed Vehicles", 
            count: fetchedStats.listedVehicles || 0, 
            color: "#10B981",
            icon: FiTruck
          },
          { 
            title: "Total Bookings", 
            count: fetchedStats.totalBookings || 0, 
            color: "#3B82F6",
            icon: FiCalendar
          },
          { 
            title: "Vehicle Brands", 
            count: fetchedStats.listedBrands || 0, 
            color: "#F59E0B",
            icon: FiTag
          },
          { 
            title: "Subscribers", 
            count: fetchedStats.subscribers || 0, 
            color: "#8B5CF6",
            icon: FiMail
          },
          { 
            title: "Customer Queries", 
            count: fetchedStats.queries || 0, 
            color: "#EC4899",
            icon: FiMessageSquare
          },
          { 
            title: "Testimonials", 
            count: fetchedStats.testimonials || 0, 
            color: "#F43F5E",
            icon: FiStar
          },
        ];

        setStats(formattedStats);
        setChartData(chartResponse.data.monthlyStats || []);
      } catch (err) {
        setError("Failed to fetch dashboard data. Please try again later.");
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    verifyAdminSession();
    fetchDashboardData();

    // Refresh data every 5 minutes
    const interval = setInterval(fetchDashboardData, 300000);
    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div style={styles.appContainer}>
      <AdminSidebar />
      
      <div style={styles.mainContent}>
        <AdminHeader admin={admin} />
        
        <div style={styles.contentArea}>
          <Dashboard 
            stats={stats} 
            loading={loading} 
            error={error} 
            chartData={chartData} 
          />
        </div>
      </div>
    </div>
  );
}

const styles = {
  appContainer: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    fontFamily: "'Inter', sans-serif",
  },
  mainContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    marginLeft: "280px",
  },
  contentArea: {
    padding: "32px",
    marginTop: "80px",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "300px",
  },
  loadingSpinner: {
    width: "50px",
    height: "50px",
    border: "5px solid #f3f3f3",
    borderTop: "5px solid #4F46E5",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "20px",
  },
  loadingText: {
    fontSize: "16px",
    color: "#64748B",
    fontWeight: "500",
  },
  errorContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
  },
  errorMessage: {
    fontSize: "16px",
    color: "#EF4444",
    marginBottom: "20px",
    textAlign: "center",
  },
  retryButton: {
    padding: "10px 20px",
    backgroundColor: "#4F46E5",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "#4338CA",
    },
  },
  dashboardContent: {
    maxWidth: "1400px",
    margin: "0 auto",
    width: "100%",
  },
  welcomeBanner: {
    backgroundColor: "#ffffff",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    marginBottom: "32px",
  },
  welcomeTitle: {
    fontSize: "28px",
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: "8px",
  },
  welcomeText: {
    fontSize: "16px",
    color: "#64748B",
    margin: 0,
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "20px",
    marginBottom: "32px",
  },
  card: {
    backgroundColor: "#fff",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 10px 15px rgba(0,0,0,0.05)",
    },
  },
  cardInner: {
    textAlign: "left",
  },
  cardCount: {
    fontSize: "28px",
    fontWeight: "700",
    margin: "8px 0",
  },
  cardTitle: {
    fontSize: "14px",
    color: "#64748B",
    fontWeight: "500",
    margin: 0,
  },
  chartContainer: {
    backgroundColor: "#fff",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    marginBottom: "32px",
  },
  chartTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: "8px",
  },
  recentActivity: {
    backgroundColor: "#fff",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: "16px",
  },
  activityList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  activityItem: {
    display: "flex",
    gap: "12px",
    alignItems: "flex-start",
    paddingBottom: "16px",
    borderBottom: "1px solid #f1f5f9",
    "&:last-child": {
      borderBottom: "none",
      paddingBottom: "0",
    },
  },
  activityDot: {
    width: "8px",
    height: "8px",
    backgroundColor: "#4F46E5",
    borderRadius: "50%",
    marginTop: "6px",
    flexShrink: 0,
  },
  activityText: {
    fontSize: "14px",
    color: "#1E293B",
    margin: "0 0 4px 0",
    fontWeight: "500",
  },
  activityTime: {
    fontSize: "12px",
    color: "#94A3B8",
    margin: 0,
  },
  "@global": {
    "@keyframes spin": {
      "0%": { transform: "rotate(0deg)" },
      "100%": { transform: "rotate(360deg)" },
    },
  },
};

export default AdminDashboard;
