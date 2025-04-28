import React, { useEffect, useState } from "react";
import { FiSearch, FiRefreshCw, FiCheck, FiClock, FiMail, FiUser } from "react-icons/fi";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import styled from "styled-components";
import { PulseLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Styled components
const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f8fafc;
`;

const MainContent = styled.main`
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

const Header = styled.div`
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

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.2s;
  background-color: #f8fafc;

  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
    background-color: white;
  }
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
`;

const RefreshButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #f1f5f9;
  color: #64748b;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;

  &:hover {
    background-color: #e2e8f0;
  }
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

const StatusButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.8rem;
  font-weight: 500;

  ${({ status }) =>
    status === "Read"
      ? `
    background-color: #10b981;
    color: white;
    &:hover {
      background-color: #059669;
    }
  `
      : `
    background-color: #f59e0b;
    color: white;
    &:hover {
      background-color: #d97706;
    }
  `}
`;

const MessageCell = styled(TableCell)`
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const EmailInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ManageQueries = () => {
  const [queries, setQueries] = useState([]);
  const [filteredQueries, setFilteredQueries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQueries();
  }, []);

  useEffect(() => {
    const filtered = queries.filter(
      (query) =>
        query.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        query.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        query.message.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredQueries(filtered);
  }, [searchTerm, queries]);

  const fetchQueries = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/allqueries");
      const data = await response.json();
      setQueries(data);
      setFilteredQueries(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching queries:", error);
      toast.error("Failed to load queries. Please try again.");
      setLoading(false);
    }
  };

  const updateQueryStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/query/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      const updatedQuery = await response.json();
      
      setQueries((prevQueries) =>
        prevQueries.map((query) =>
          query._id === id ? { ...query, status: updatedQuery.status } : query
        )
      );

      toast.success(`Query marked as ${newStatus}`);
    } catch (error) {
      console.error("Error updating query status:", error);
      toast.error("Failed to update status. Please try again.");
    }
  };

  return (
    <PageContainer>
      <AdminSidebar />
      <MainContent>
        <AdminHeader />
        <ToastContainer position="top-right" autoClose={3000} />
        <Card>
          <Header>
            <Title>Contact Us Queries</Title>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <SearchContainer>
                <SearchIcon />
                <SearchInput
                  type="text"
                  placeholder="Search queries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </SearchContainer>
              <RefreshButton onClick={fetchQueries}>
                <FiRefreshCw />
                Refresh
              </RefreshButton>
            </div>
          </Header>

          {loading ? (
            <LoadingContainer>
              <PulseLoader color="#4f46e5" size={10} />
            </LoadingContainer>
          ) : filteredQueries.length === 0 ? (
            <EmptyState>
              {searchTerm ? (
                <>
                  <h3>No queries found</h3>
                  <p>Try adjusting your search term</p>
                </>
              ) : (
                <>
                  <h3>No queries yet</h3>
                  <p>Customer queries will appear here</p>
                </>
              )}
            </EmptyState>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <Table>
                <TableHeader>
                  <tr>
                    <TableHeaderCell>#</TableHeaderCell>
                    <TableHeaderCell>Name</TableHeaderCell>
                    <TableHeaderCell>Email</TableHeaderCell>
                    <TableHeaderCell>Message</TableHeaderCell>
                    <TableHeaderCell>Date</TableHeaderCell>
                    <TableHeaderCell>Status</TableHeaderCell>
                  </tr>
                </TableHeader>
                <tbody>
                  {filteredQueries.map((query, index) => (
                    <TableRow key={query._id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <UserInfo>
                          <FiUser size={14} />
                          {query.name}
                        </UserInfo>
                      </TableCell>
                      <TableCell>
                        <EmailInfo>
                          <FiMail size={14} />
                          {query.email}
                        </EmailInfo>
                      </TableCell>
                      <MessageCell title={query.message}>
                        {query.message}
                      </MessageCell>
                      <TableCell>
                        {new Date(query.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </TableCell>
                      <TableCell>
                        <StatusButton
                          status={query.status}
                          onClick={() =>
                            updateQueryStatus(
                              query._id,
                              query.status === "Read" ? "Pending" : "Read"
                            )
                          }
                        >
                          {query.status === "Read" ? (
                            <FiCheck size={14} />
                          ) : (
                            <FiClock size={14} />
                          )}
                          {query.status}
                        </StatusButton>
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

export default ManageQueries;