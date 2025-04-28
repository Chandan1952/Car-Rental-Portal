import React, { useState } from "react";
import { FiLock, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import styled, { keyframes } from "styled-components";
import Header from "./Header";
import ProfileHeader from "./ProfileHeader";
import Footer from "./Footer";
import UserSidebar from "../components/UserSidebar";

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(74, 144, 226, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(74, 144, 226, 0); }
  100% { box-shadow: 0 0 0 0 rgba(74, 144, 226, 0); }
`;

// Styled Components
const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 32px;
  padding: 0 24px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  gap: 24px;
`;

const MainContent = styled.div`
  flex: 1;
  min-width: 300px;
  max-width: 500px;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  background-color: #ffffff;
  animation: ${fadeIn} 0.3s ease-out;
`;

const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 24px;
  color: #2d3748;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

const InputContainer = styled.div`
  position: relative;
  margin-bottom: 20px;
`;

const InputIcon = styled.span`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #a0aec0;
`;

const InputField = styled.input`
  width: 100%;
  padding: 14px 16px 14px 44px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  font-size: 1rem;
  transition: all 0.2s;
  background-color: #f8fafc;
  
  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
    background-color: #fff;
  }
  
  &::placeholder {
    color: #a0aec0;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 16px;
  border-radius: 10px;
  background-color: #4299e1;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  &:hover {
    background-color: #3182ce;
  }
  
  &:active {
    transform: scale(0.98);
  }
  
  &:focus {
    outline: none;
    animation: ${pulse} 1s;
  }
`;

const Message = styled.div`
  margin-top: 20px;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 10px;
  animation: ${fadeIn} 0.3s ease-out;
  background-color: ${props => props.success ? "#f0fff4" : "#fff5f5"};
  color: ${props => props.success ? "#2f855a" : "#c53030"};
`;

const PasswordRequirements = styled.div`
  margin: 16px 0;
  padding: 12px;
  background-color: #f8fafc;
  border-radius: 8px;
  font-size: 0.85rem;
  color: #4a5568;
  
  ul {
    margin: 8px 0 0 0;
    padding-left: 20px;
  }
  
  li {
    margin-bottom: 4px;
  }
`;

export default function UpdatePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async () => {
    setMessage("");
    
    if (newPassword !== confirmPassword) {
      setIsSuccess(false);
      setMessage("New passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setIsSuccess(false);
      setMessage("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setMessage("Password updated successfully!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setIsSuccess(false);
        setMessage(data.error || "Password update failed. Please check your current password.");
      }
    } catch (error) {
      setIsSuccess(false);
      setMessage("Network error. Please try again.");
    } finally {
      setIsLoading(false);
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
            <FiLock size={24} /> Update Password
          </Title>

          <InputContainer>
            <InputIcon>
              <FiLock />
            </InputIcon>
            <InputField
              type="password"
              placeholder="Current Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </InputContainer>

          <InputContainer>
            <InputIcon>
              <FiLock />
            </InputIcon>
            <InputField
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </InputContainer>

          <InputContainer>
            <InputIcon>
              <FiLock />
            </InputIcon>
            <InputField
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </InputContainer>

          <PasswordRequirements>
            <strong>Password Requirements:</strong>
            <ul>
              <li>Minimum 8 characters</li>
              <li>Include numbers and special characters</li>
              <li>Avoid common passwords</li>
            </ul>
          </PasswordRequirements>

          <Button onClick={handleUpdate} disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Password"}
          </Button>

          {message && (
            <Message success={isSuccess}>
              {isSuccess ? <FiCheckCircle size={18} /> : <FiAlertCircle size={18} />}
              {message}
            </Message>
          )}
        </MainContent>
      </Container>
      <Footer />
    </>
  );
}