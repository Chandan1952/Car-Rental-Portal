import React, { useState, useEffect } from "react";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import { FiSearch, FiTrash2, FiCheck, FiX } from "react-icons/fi";
import { MdOutlinePendingActions } from "react-icons/md";
import { BsCashCoin } from "react-icons/bs";
import { FaCarAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import styled from "styled-components";

const Container = styled.div`
  max-width: 1200px;
  margin: 20px 0 0 250px;
  padding: 30px;
  background-color: #fff;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    margin: 20px 15px;
    padding: 20px;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 25px;
  width: 100%;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 14px 20px 14px 45px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  font-size: 16px;
  box-sizing: border-box;
  transition: all 0.3s ease;
  background-color: #f8f9fa;

  &:focus {
    outline: none;
    border-color: #4a6bff;
    box-shadow: 0 0 0 2px rgba(74, 107, 255, 0.2);
    background-color: white;
  }
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 20px;
`;

const TableHeader = styled.th`
  padding: 16px;
  text-align: left;
  background-color: #f8f9fa;
  color: #495057;
  font-weight: 600;
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 2px solid #e9ecef;
`;

const TableCell = styled.td`
  padding: 16px;
  border-bottom: 1px solid #e9ecef;
  color: #495057;
`;

const TableRow = styled.tr`
  transition: all 0.2s ease;

  &:hover {
    background-color: #f8f9fa;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
`;

const StatusBadge = styled.span`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  display: inline-block;
  text-transform: capitalize;

  ${({ status }) => {
    switch (status) {
      case "approved":
        return "background-color: #e6f7ee; color: #28a745;";
      case "rejected":
        return "background-color: #fce8e6; color: #dc3545;";
      case "pending":
        return "background-color: #fff3cd; color: #ffc107;";
      default:
        return "background-color: #e2e3e5; color: #383d41;";
    }
  }}
`;

const ActionButton = styled.button`
  border: none;
  cursor: pointer;
  font-size: 16px;
  margin: 0 5px;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
  }
`;

const ApproveButton = styled(ActionButton)`
  background-color: #28a745;
  color: white;

  &:hover {
    background-color: #218838;
  }
`;

const RejectButton = styled(ActionButton)`
  background-color: #dc3545;
  color: white;

  &:hover {
    background-color: #c82333;
  }
`;

const DeleteButton = styled(ActionButton)`
  background-color: #6c757d;
  color: white;

  &:hover {
    background-color: #5a6268;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const LoadingSpinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #4a6bff;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  padding: 15px;
  background-color: #f8d7da;
  color: #721c24;
  border-radius: 6px;
  margin: 20px 0;
  border: 1px solid #f5c6cb;
`;

const NoBookingsMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #6c757d;
  font-size: 18px;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin-top: 20px;
`;

const PaymentMethod = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const VehicleInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const AdminManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch("https://car-rental-portal-backend.onrender.com/api/admin/bookings");
        if (!response.ok) throw new Error("Failed to fetch bookings");
        const data = await response.json();
        setBookings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      const response = await fetch(`https://car-rental-portal-backend.onrender.com/api/admin/bookings/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error("Failed to update status");

      setBookings(bookings.map((b) => (b._id === id ? { ...b, status } : b)));
    } catch (err) {
      alert("Error updating booking: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        await fetch(`https://car-rental-portal-backend.onrender.com/api/mybookings/${id}`, { method: "DELETE" });
        setBookings(bookings.filter((b) => b._id !== id));
        alert("Booking deleted successfully");
      } catch (err) {
        alert("Error deleting booking: " + err.message);
      }
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const userName = booking.userId?.fullName?.toLowerCase() || "";
    const userEmail = booking.userId?.email?.toLowerCase() || "";
    const carBrand = booking.carId?.brand?.toLowerCase() || "";
    const carModel = booking.carId?.model?.toLowerCase() || "";

    return (
      userName.includes(search.toLowerCase()) ||
      userEmail.includes(search.toLowerCase()) ||
      carBrand.includes(search.toLowerCase()) ||
      carModel.includes(search.toLowerCase())
    );
  });

  return (
    <>
      <AdminHeader />
      <AdminSidebar />
      <Container>
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{ color: "#343a40", marginBottom: "25px" }}
        >
          Manage Bookings
        </motion.h2>
        
        <SearchContainer>
          <SearchIcon size={20} />
          <SearchInput
            type="text"
            placeholder="Search by name, email, or vehicle..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </SearchContainer>

        {loading && (
          <LoadingContainer>
            <LoadingSpinner />
          </LoadingContainer>
        )}

        {error && (
          <ErrorMessage>
            {error}
          </ErrorMessage>
        )}

        {!loading && !error && (
          <>
            {filteredBookings.length === 0 ? (
              <NoBookingsMessage>
                No bookings found matching your search criteria
              </NoBookingsMessage>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <Table>
                  <thead>
                    <tr>
                      <TableHeader>#</TableHeader>
                      <TableHeader>Customer</TableHeader>
                      <TableHeader>Email</TableHeader>
                      <TableHeader>Vehicle</TableHeader>
                      <TableHeader>From Date</TableHeader>
                      <TableHeader>To Date</TableHeader>
                      <TableHeader>Amount</TableHeader>
                      <TableHeader>Payment</TableHeader>
                      <TableHeader>Status</TableHeader>
                      <TableHeader>Actions</TableHeader>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking, index) => (
                      <TableRow 
                        key={booking._id}
                        onMouseEnter={() => setHoveredRow(booking._id)}
                        onMouseLeave={() => setHoveredRow(null)}
                      >
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{booking.userId?.fullName || "N/A"}</TableCell>
                        <TableCell>{booking.userId?.email || "N/A"}</TableCell>
                        <TableCell>
                          <VehicleInfo>
                            <FaCarAlt color="#4a6bff" />
                            {booking.carId?.brand || "Unknown"} {booking.carId?.model || ""}
                          </VehicleInfo>
                        </TableCell>
                        <TableCell>
                          {booking.fromDate ? new Date(booking.fromDate).toLocaleDateString() : "N/A"}
                        </TableCell>
                        <TableCell>
                          {booking.toDate ? new Date(booking.toDate).toLocaleDateString() : "N/A"}
                        </TableCell>
                        <TableCell>₹{booking.amount || "N/A"}</TableCell>
                        <TableCell>
                          <PaymentMethod>
                            {booking.paymentId === "COD" ? (
                              <>
                                <BsCashCoin /> Cash on Delivery
                              </>
                            ) : (
                              booking.paymentId
                            )}
                          </PaymentMethod>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={booking.status?.toLowerCase() || "pending"}>
                            {booking.status || "Pending"}
                          </StatusBadge>
                        </TableCell>
                        <TableCell>
                          <motion.div 
                            style={{ display: "flex", gap: "8px" }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <ApproveButton
                              onClick={() => handleStatusChange(booking._id, "Approved")}
                              title="Approve"
                            >
                              <FiCheck />
                            </ApproveButton>
                            <RejectButton
                              onClick={() => handleStatusChange(booking._id, "Rejected")}
                              title="Reject"
                            >
                              <FiX />
                            </RejectButton>
                            <DeleteButton
                              onClick={() => handleDelete(booking._id)}
                              title="Delete"
                            >
                              <FiTrash2 />
                            </DeleteButton>
                          </motion.div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </>
        )}
      </Container>
    </>
  );
};

export default AdminManageBookings;
