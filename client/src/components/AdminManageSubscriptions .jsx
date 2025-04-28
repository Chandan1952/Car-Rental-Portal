import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { FaDownload, FaTrash, FaSearch } from "react-icons/fa";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import styled from "styled-components";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PulseLoader } from "react-spinners";

// Styled components for better organization and theming
const PageContainer = styled.div`
  background-color: #f8fafc;
  min-height: 100vh;
  display: flex;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 2rem;
  margin-left: 220px;
  transition: all 0.3s;

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 1rem;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 2rem;
  margin-top: 1.5rem;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  color: #1e293b;
  font-weight: 600;
  margin: 0;
`;

const ActionButton = styled.button`
  background-color: #4f46e5;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;

  &:hover {
    background-color: #4338ca;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 300px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.5rem 1rem 0.5rem 2.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
  }
`;

const SearchIcon = styled(FaSearch)`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 1.5rem;
`;

const TableHeader = styled.thead`
  background-color: #f1f5f9;
`;

const TableHeaderCell = styled.th`
  padding: 1rem;
  text-align: left;
  color: #64748b;
  font-weight: 500;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #e2e8f0;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f8fafc;
  }

  &:hover {
    background-color: #f1f5f9;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  color: #334155;
  font-size: 0.9rem;
  border-bottom: 1px solid #e2e8f0;
`;

const DeleteButton = styled.button`
  background-color: #ef4444;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.8rem;

  &:hover {
    background-color: #dc2626;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #64748b;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 2rem;
`;

const ManageSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  useEffect(() => {
    const filtered = subscriptions.filter(sub =>
      sub.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSubscriptions(filtered);
  }, [searchTerm, subscriptions]);

  const fetchSubscriptions = async () => {
    try {
      const response = await fetch("https://car-rental-portal-backend.onrender.com/subscriptions");
      const data = await response.json();
      setSubscriptions(data);
      setFilteredSubscriptions(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      toast.error("Failed to load subscriptions. Please try again.");
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subscription?")) return;
    try {
      const response = await fetch(`https://car-rental-portal-backend.onrender.com/subscriptions/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      toast.success(data.message);
      setSubscriptions(subscriptions.filter((sub) => sub._id !== id));
    } catch (error) {
      console.error("Error deleting subscription:", error);
      toast.error("Failed to delete subscription. Please try again.");
    }
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredSubscriptions.map((sub, index) => ({
        "S.No": index + 1,
        Email: sub.email,
        "Date Subscribed": new Date(sub.subscribedAt).toLocaleDateString(),
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Subscriptions");
    XLSX.writeFile(workbook, "subscriptions.xlsx");
    toast.success("Excel file downloaded successfully!");
  };

  return (
    <PageContainer>
      <AdminSidebar />
      <MainContent>
        <AdminHeader />
        <ToastContainer position="top-right" autoClose={3000} />
        <Card>
          <CardHeader>
            <Title>Manage Subscriptions</Title>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <SearchContainer>
                <SearchIcon />
                <SearchInput
                  type="text"
                  placeholder="Search by email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </SearchContainer>
              <ActionButton onClick={downloadExcel}>
                <FaDownload />
                Export
              </ActionButton>
            </div>
          </CardHeader>

          {loading ? (
            <LoadingContainer>
              <PulseLoader color="#4f46e5" size={10} />
            </LoadingContainer>
          ) : filteredSubscriptions.length === 0 ? (
            <EmptyState>
              {searchTerm ? (
                <>
                  <h3>No subscriptions found</h3>
                  <p>Try adjusting your search query</p>
                </>
              ) : (
                <>
                  <h3>No subscriptions yet</h3>
                  <p>Subscribers will appear here once they sign up</p>
                </>
              )}
            </EmptyState>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <Table>
                <TableHeader>
                  <tr>
                    <TableHeaderCell>#</TableHeaderCell>
                    <TableHeaderCell>Email</TableHeaderCell>
                    <TableHeaderCell>Date Subscribed</TableHeaderCell>
                    <TableHeaderCell>Actions</TableHeaderCell>
                  </tr>
                </TableHeader>
                <tbody>
                  {filteredSubscriptions.map((sub, index) => (
                    <TableRow key={sub._id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{sub.email}</TableCell>
                      <TableCell>
                        {new Date(sub.subscribedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </TableCell>
                      <TableCell>
                        <DeleteButton onClick={() => handleDelete(sub._id)}>
                          <FaTrash />
                          Delete
                        </DeleteButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card>
      </MainContent>
    </PageContainer>
  );
};

export default ManageSubscriptions;
