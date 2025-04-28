import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaStar, FaSpinner } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";

const TestimonialContainer = styled.div`
  position: relative;
  width: 100%;
  min-height: 600px;
  background: linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.65) 100%), 
              url('https://images.unsplash.com/photo-1494976388531-d1058494cdd8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80') center/cover no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  font-family: 'Poppins', sans-serif;
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 2;
  color: white;
  max-width: 1200px;
  width: 100%;
  text-align: center;
`;

const SectionHeading = styled.h2`
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 700;
  margin-bottom: 50px;
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background: linear-gradient(90deg, #ff4b2b, #ff416c);
    border-radius: 3px;
  }
`;

const TestimonialCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  color: #333;
  padding: 40px;
  border-radius: 20px;
  max-width: 800px;
  width: 100%;
  text-align: center;
  margin: 0 auto;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.25);
  position: relative;
  overflow: hidden;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  &::before {
    content: "❝";
    position: absolute;
    top: 20px;
    left: 20px;
    font-size: 80px;
    color: rgba(255, 75, 43, 0.1);
    font-family: serif;
    line-height: 1;
  }
`;

const UserSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 25px;
`;

const UserAvatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff4b2b, #ff416c);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 15px;
  box-shadow: 0 5px 15px rgba(255, 75, 43, 0.4);
`;

const UserName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 5px;
`;

const StarsWrapper = styled.div`
  display: flex;
  gap: 5px;
  margin-bottom: 10px;
`;

const TestimonialText = styled.p`
  font-size: clamp(1rem, 2vw, 1.1rem);
  line-height: 1.8;
  font-style: italic;
  position: relative;
  padding: 0 20px;
  
  &::before, &::after {
    content: '"';
    font-size: 24px;
    color: #ff4b2b;
    opacity: 0.6;
  }
`;

const NavigationButtons = styled.div`
  position: absolute;
  top: 50%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  transform: translateY(-50%);
  padding: 0 20px;
  pointer-events: none;
`;

const NavButton = styled.button`
  background: rgba(255, 255, 255, 0.9);
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  pointer-events: all;
  
  &:hover {
    background: white;
    transform: scale(1.1);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const DotNavigation = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 40px;
`;

const Dot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.active ? '#ff4b2b' : 'rgba(255,255,255,0.5)'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.2);
  }
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
`;

const Spinner = styled(FaSpinner)`
  animation: spin 1s linear infinite;
  font-size: 40px;
  color: #ff4b2b;

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const ErrorState = styled.div`
  color: #ff4b2b;
  font-weight: 600;
  font-size: 1.1rem;
`;

const EmptyState = styled.div`
  color: #666;
  font-style: italic;
`;

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch("http://localhost:5000/testimonials");
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setTestimonials(data);
      } catch (err) {
        console.error("Error fetching testimonials:", err);
        setError("Failed to load testimonials. Please try again later.");
        // Fallback to mock data if API fails
        setTestimonials([
          {
            id: 1,
            name: "Sarah Johnson",
            initials: "SJ",
            rating: 5,
            testimonial: "The car rental experience was seamless from start to finish."
          },
          {
            id: 2,
            name: "Michael Chen",
            initials: "MC",
            rating: 4,
            testimonial: "Great selection of vehicles at competitive prices."
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (testimonials.length > 0) {
      const interval = setInterval(() => {
        setDirection(1);
        setIndex((prev) => (prev + 1) % testimonials.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [testimonials.length]);

  const nextSlide = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToSlide = (idx) => {
    setDirection(idx > index ? 1 : -1);
    setIndex(idx);
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  const getInitials = (name) => {
    if (!name) return "US";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <TestimonialContainer>
      <ContentWrapper>
        <SectionHeading>What Our Clients Say</SectionHeading>

        <div style={{ position: 'relative', height: '400px' }}>
          <AnimatePresence custom={direction} initial={false}>
            {loading ? (
              <TestimonialCard
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <LoadingState>
                  <Spinner />
                  <p>Loading testimonials...</p>
                </LoadingState>
              </TestimonialCard>
            ) : error ? (
              <TestimonialCard
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ErrorState>
                  {error}
                  <p style={{ marginTop: '20px', fontSize: '0.9rem', color: '#666' }}>
                    Showing sample testimonials instead
                  </p>
                </ErrorState>
              </TestimonialCard>
            ) : testimonials.length === 0 ? (
              <TestimonialCard
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <EmptyState>No testimonials available at this time.</EmptyState>
              </TestimonialCard>
            ) : (
              <TestimonialCard
                key={testimonials[index].id}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
              >
                <UserSection>
                  <UserAvatar>
                    {getInitials(testimonials[index].name)}
                  </UserAvatar>
                  <UserName>{testimonials[index].name}</UserName>
                  <StarsWrapper>
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        color={i < testimonials[index].rating ? "#ffc107" : "#e0e0e0"}
                        size={20}
                      />
                    ))}
                  </StarsWrapper>
                </UserSection>
                <TestimonialText>
                  {testimonials[index].testimonial}
                </TestimonialText>
              </TestimonialCard>
            )}
          </AnimatePresence>
        </div>

        {!loading && testimonials.length > 0 && (
          <DotNavigation>
            {testimonials.map((_, idx) => (
              <Dot 
                key={idx} 
                active={idx === index} 
                onClick={() => goToSlide(idx)}
              />
            ))}
          </DotNavigation>
        )}
      </ContentWrapper>

      {!loading && testimonials.length > 1 && (
        <NavigationButtons>
          <NavButton onClick={prevSlide} disabled={loading}>
            <FaChevronLeft />
          </NavButton>
          <NavButton onClick={nextSlide} disabled={loading}>
            <FaChevronRight />
          </NavButton>
        </NavigationButtons>
      )}
    </TestimonialContainer>
  );
};

export default Testimonials;