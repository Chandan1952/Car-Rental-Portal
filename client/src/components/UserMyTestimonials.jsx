import React, { useState, useEffect } from "react";
import { FaClock, FaTimesCircle, FaCheckCircle, FaTrash, FaRedo } from "react-icons/fa";
import { FiMessageSquare } from "react-icons/fi";
import Header from "./Header";
import ProfileHeader from "./ProfileHeader";
import Footer from "./Footer";
import UserSidebar from "../components/UserSidebar";
import styled, { keyframes } from "styled-components";

// Animation for loading
const shimmer = keyframes`
  0% { background-position: -468px 0 }
  100% { background-position: 468px 0 }
`;

// Styled components
const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 24px;
  padding: 0 16px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  gap: 20px;
`;

const MainContent = styled.div`
  flex: 1;
  background: #fff;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
  color: #2d3748;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const TestimonialList = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
`;

const TestimonialCard = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
  border-left: 4px solid ${props => 
    props.status === 'approved' ? '#48BB78' : 
    props.status === 'disapproved' ? '#F56565' : '#ED8936'};
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`;

const TestimonialText = styled.p`
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 12px;
  font-size: 15px;
`;

const MetaInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  font-size: 14px;
`;

const DateText = styled.span`
  color: #718096;
`;

const StatusBadge = styled.span`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: ${props => 
    props.status === 'approved' ? '#F0FFF4' : 
    props.status === 'disapproved' ? '#FFF5F5' : '#FFFAF0'};
  color: ${props => 
    props.status === 'approved' ? '#38A169' : 
    props.status === 'disapproved' ? '#E53E3E' : '#DD6B20'};
`;

const DeleteButton = styled.button`
  background: #FFF5F5;
  color: #E53E3E;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
  transition: all 0.2s;
  
  &:hover {
    background: #FED7D7;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #718096;
`;

const ErrorMessage = styled.div`
  background: #FFF5F5;
  color: #E53E3E;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const RetryButton = styled.button`
  padding: 10px 16px;
  background: #4299E1;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  align-self: center;
  transition: background 0.2s;
  
  &:hover {
    background: #3182CE;
  }
`;

const LoadingSkeleton = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
`;

const SkeletonItem = styled.div`
  background: linear-gradient(to right, #f6f7f8 0%, #edeef1 20%, #f6f7f8 40%, #f6f7f8 100%);
  background-size: 800px 104px;
  animation: ${shimmer} 1.5s infinite linear;
  height: 120px;
  border-radius: 8px;
`;

export default function MyTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5000/api/mytestimonials", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to fetch testimonials");

      const data = await response.json();
      const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setTestimonials(sorted);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      setError("Could not load testimonials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deleteTestimonial = async (id) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/mytestimonials/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to delete testimonial");

      setTestimonials((prev) => prev.filter((t) => t._id !== id));
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      alert("Failed to delete testimonial. Please try again.");
    }
  };

  const getStatus = (t) => {
    if (t.disapproved) return 'disapproved';
    if (t.approved) return 'approved';
    return 'pending';
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'approved':
        return <FaCheckCircle />;
      case 'disapproved':
        return <FaTimesCircle />;
      default:
        return <FaClock />;
    }
  };

  return (
    <>
      <Header />
      <ProfileHeader />
      <Container>
        <UserSidebar />
        <MainContent>
          <Title>
            <FiMessageSquare /> My Testimonials
          </Title>

          {loading ? (
            <LoadingSkeleton>
              {[...Array(3)].map((_, i) => <SkeletonItem key={i} />)}
            </LoadingSkeleton>
          ) : error ? (
            <ErrorMessage>
              <p>{error}</p>
              <RetryButton onClick={fetchTestimonials}>
                <FaRedo /> Retry
              </RetryButton>
            </ErrorMessage>
          ) : testimonials.length > 0 ? (
            <TestimonialList>
              {testimonials.map((t) => {
                const status = getStatus(t);
                return (
                  <TestimonialCard key={t._id} status={status}>
                    <TestimonialText>
                      {t.testimonial || "No content available."}
                    </TestimonialText>
                    <MetaInfo>
                      <DateText>
                        Posted on {t.date ? new Date(t.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : "N/A"}
                      </DateText>
                      <StatusBadge status={status}>
                        {getStatusIcon(status)} 
                        {status === 'approved' ? 'Approved' : 
                         status === 'disapproved' ? 'Disapproved' : 'Pending Approval'}
                      </StatusBadge>
                    </MetaInfo>
                    <DeleteButton onClick={() => deleteTestimonial(t._id)}>
                      <FaTrash /> Delete
                    </DeleteButton>
                  </TestimonialCard>
                );
              })}
            </TestimonialList>
          ) : (
            <EmptyState>
              <FiMessageSquare size={48} style={{ opacity: 0.5, marginBottom: '16px' }} />
              <h3>No testimonials yet</h3>
              <p>You haven't submitted any testimonials.</p>
            </EmptyState>
          )}
        </MainContent>
      </Container>
      <Footer />
    </>
  );
}