import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaArrowRight, FaCar, FaStar, FaGasPump, FaTachometerAlt, FaUserFriends } from 'react-icons/fa';
import { MdAirlineSeatReclineNormal, MdOutlineElectricCar } from 'react-icons/md';

const BASE_URL = "http://localhost:5000";

export default function CarRentalHomePage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  
  const ITEMS_PER_PAGE = 3; // Changed to 3 for better display

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/vehiclesdetails`);
        if (!response.ok) throw new Error("Failed to fetch vehicles");
        const data = await response.json();
        setCars(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovered) { // Pause auto-rotation when hovered
        setCurrentIndex((prev) => (prev + ITEMS_PER_PAGE) % cars.length);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [cars.length, isHovered]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + ITEMS_PER_PAGE) % cars.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - ITEMS_PER_PAGE + cars.length) % cars.length);
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  if (loading) return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '50vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      <div className="spinner" style={{
        width: '50px',
        height: '50px',
        border: '5px solid #f3f3f3',
        borderTop: '5px solid #4f46e5',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
    </div>
  );

  if (error) return (
    <div style={{ 
      textAlign: 'center', 
      padding: '2rem',
      background: '#fff1f1',
      borderRadius: '8px',
      maxWidth: '600px',
      margin: '2rem auto',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <h3 style={{ color: '#ef4444' }}>Error Loading Vehicles</h3>
      <p style={{ color: '#7f1d1d' }}>{error}</p>
      <button 
        onClick={() => window.location.reload()}
        style={{
          padding: '0.5rem 1rem',
          background: '#4f46e5',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '1rem'
        }}
      >
        Try Again
      </button>
    </div>
  );

  const visibleCars = cars.slice(currentIndex, currentIndex + ITEMS_PER_PAGE).length === ITEMS_PER_PAGE
    ? cars.slice(currentIndex, currentIndex + ITEMS_PER_PAGE)
    : [...cars.slice(currentIndex), ...cars.slice(0, ITEMS_PER_PAGE - (cars.length - currentIndex))];

  const numberOfDots = Math.ceil(cars.length / ITEMS_PER_PAGE);

  return (
    <div style={{ 
      minHeight: '80vh', 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      color: '#2d3748', 
      padding: '3rem 1rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative elements */}
      <div style={{
        position: 'absolute',
        top: '-50px',
        right: '-50px',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: 'rgba(79, 70, 229, 0.1)',
        zIndex: '0'
      }}></div>
      
      <div style={{
        position: 'absolute',
        bottom: '-100px',
        left: '-100px',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'rgba(79, 70, 229, 0.05)',
        zIndex: '0'
      }}></div>

      <div style={{ position: 'relative', zIndex: '1' }}>
        <h2 style={{
          textAlign: 'center', 
          fontSize: '2.5rem', 
          fontWeight: '700', 
          color: '#312e81', 
          marginBottom: '1rem',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          position: 'relative',
          display: 'inline-block',
          left: '50%',
          transform: 'translateX(-50%)',
          paddingBottom: '0.5rem'
        }}>
          <span style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            width: '100%',
            height: '4px',
            background: 'linear-gradient(90deg, #4f46e5, #a78bfa)',
            borderRadius: '2px'
          }}></span>
          Premium Fleet Selection
        </h2>

        <p style={{
          textAlign: 'center',
          color: '#4b5563',
          maxWidth: '700px',
          margin: '0 auto 3rem',
          fontSize: '1.1rem',
          lineHeight: '1.6'
        }}>
          Discover our exclusive collection of premium vehicles. Each car is meticulously maintained to ensure your comfort and safety.
        </p>

        <div
          style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '2rem',
            transition: 'transform 1s ease-in-out',
            paddingBottom: '2rem',
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            style={{
              position: 'absolute',
              top: '50%',
              left: '10px',
              transform: 'translateY(-50%)',
              fontSize: '1.5rem',
              backgroundColor: 'white',
              border: 'none',
              cursor: 'pointer',
              padding: '1rem',
              borderRadius: '50%',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
              zIndex: '10',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#4f46e5'
            }}
            aria-label="Previous"
          >
            <FaArrowLeft />
          </button>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            style={{
              position: 'absolute',
              top: '50%',
              right: '10px',
              transform: 'translateY(-50%)',
              fontSize: '1.5rem',
              backgroundColor: 'white',
              border: 'none',
              cursor: 'pointer',
              padding: '1rem',
              borderRadius: '50%',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
              zIndex: '10',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#4f46e5'
            }}
            aria-label="Next"
          >
            <FaArrowRight />
          </button>

          {/* Car Cards */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            overflow: 'hidden',
            padding: '1rem',
          }}>
            {visibleCars.map((car, index) => {
              const imageUrl = car.images?.length
                ? `${BASE_URL}${car.images[0].startsWith("/") ? car.images[0] : "/" + car.images[0]}`
                : "https://via.placeholder.com/300x200?text=No+Image";

              return (
                <div
                  key={index}
                  style={{
                    flex: '0 0 320px',
                    backgroundColor: 'white',
                    borderRadius: '1.5rem',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
                    padding: '1.5rem',
                    textAlign: 'center',
                    transition: 'all 0.4s ease',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    zIndex: '1',
                    ':hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: '0 15px 30px rgba(0, 0, 0, 0.12)'
                    }
                  }}
                  onClick={() => navigate(`/car-details/${car._id}`)}
                >
                  {/* Popular badge */}
                  {index === 1 && (
                    <div style={{
                      position: 'absolute',
                      top: '15px',
                      right: '15px',
                      backgroundColor: '#f59e0b',
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      zIndex: '2',
                      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
                    }}>
                      Popular
                    </div>
                  )}

                  {/* Car image with gradient overlay */}
                  <div style={{
                    position: 'relative',
                    borderRadius: '1rem',
                    overflow: 'hidden',
                    marginBottom: '1.5rem',
                    height: '180px'
                  }}>
                    <img
                      src={imageUrl}
                      alt={car.model}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease'
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      bottom: '0',
                      left: '0',
                      right: '0',
                      height: '50%',
                      background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                      display: 'flex',
                      alignItems: 'flex-end',
                      padding: '1rem',
                      color: 'white'
                    }}>
                      <h3 style={{
                        margin: '0',
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        textShadow: '0 1px 3px rgba(0,0,0,0.3)'
                      }}>
                        {car.brand} {car.model}
                      </h3>
                    </div>
                  </div>

                  {/* Price and rating */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1.5rem'
                  }}>
                    <div style={{
                      fontSize: '1.5rem',
                      fontWeight: '700',
                      color: '#4f46e5'
                    }}>
                      ${car.pricePerDay || '120'}<span style={{ fontSize: '1rem', color: '#6b7280' }}>/day</span>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      color: '#f59e0b'
                    }}>
                      <FaStar style={{ marginRight: '0.25rem' }} />
                      {car.rating || '4.8'}
                    </div>
                  </div>

                  {/* Car features */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '1rem',
                    marginBottom: '1.5rem'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: '0.875rem',
                      color: '#4b5563'
                    }}>
                      <MdAirlineSeatReclineNormal style={{ marginRight: '0.5rem', color: '#4f46e5' }} />
                      {car.seats || '5'} Seats
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: '0.875rem',
                      color: '#4b5563'
                    }}>
                      <FaGasPump style={{ marginRight: '0.5rem', color: '#4f46e5' }} />
                      {car.fuelType || 'Petrol'}
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: '0.875rem',
                      color: '#4b5563'
                    }}>
                      <FaTachometerAlt style={{ marginRight: '0.5rem', color: '#4f46e5' }} />
                      {car.mileage || '12k'} km
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: '0.875rem',
                      color: '#4b5563'
                    }}>
                      {car.transmission === 'Automatic' ? (
                        <MdOutlineElectricCar style={{ marginRight: '0.5rem', color: '#4f46e5' }} />
                      ) : (
                        <FaCar style={{ marginRight: '0.5rem', color: '#4f46e5' }} />
                      )}
                      {car.transmission || 'Automatic'}
                    </div>
                  </div>

                  {/* View Details button */}
                  <button
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: 'linear-gradient(90deg, #4f46e5, #7c3aed)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '1rem',
                      transition: 'all 0.3s ease',
                      ':hover': {
                        background: 'linear-gradient(90deg, #4338ca, #6d28d9)',
                        boxShadow: '0 4px 10px rgba(79, 70, 229, 0.3)'
                      }
                    }}
                  >
                    Book Now
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dots Navigation */}
        <div style={{
          textAlign: 'center',
          marginTop: '2rem',
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
        }}>
          {Array.from({ length: numberOfDots }).map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index * ITEMS_PER_PAGE)}
              style={{
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s',
                backgroundColor: currentIndex === index * ITEMS_PER_PAGE ? '#4f46e5' : '#e5e7eb',
                transform: currentIndex === index * ITEMS_PER_PAGE ? 'scale(1.2)' : 'scale(1)',
                ':hover': {
                  backgroundColor: currentIndex === index * ITEMS_PER_PAGE ? '#4f46e5' : '#d1d5db'
                }
              }}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
}