import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiStar, FiClock, FiUsers, FiDroplet } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = "http://localhost:5000";

export default function CarListing() {
  const [cars, setCars] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visibleCars, setVisibleCars] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/vehiclesdetails`);
        if (!response.ok) throw new Error("Failed to fetch vehicles");
        const data = await response.json();
        setCars(data);
      } catch (err) {
        setError(err.message);
        toast.error("Failed to load vehicles");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const loadMoreCars = () => {
    setVisibleCars(prev => prev + 5);
  };

  return (
    <div className="car-listing-page">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Discover Your Perfect Ride</h1>
          <p className="hero-subtitle">
            Explore our premium collection of vehicles tailored for every journey
          </p>
        </div>
      </section>

      <div className="car-listing-container">
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading our collection...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
          </div>
        ) : cars.length === 0 ? (
          <div className="empty-state">
            <h3>No vehicles available at the moment</h3>
            <p>Please check back later or contact our support</p>
          </div>
        ) : (
          <>
            <div className="car-grid">
              {cars.slice(0, visibleCars).map((car) => {
                const imageUrl = car.images?.length
                  ? `${BASE_URL}${car.images[0].startsWith("/") ? car.images[0] : "/" + car.images[0]}`
                  : "https://images.unsplash.com/photo-1494972308805-463bc619d34e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80";

                return (
                  <div key={car._id} className="car-card">
                    <div className="car-image-container">
                      <img src={imageUrl} alt={car.title} className="car-image" />
                      <div className="car-badge">Popular</div>
                    </div>
                    <div className="car-content">
                      <div className="car-header">
                        <h2 className="car-title">{car.brand} {car.title}</h2>
                        <div className="car-rating">
                          <FiStar className="star-icon" />
                          <span>4.8</span>
                        </div>
                      </div>
                      <p className="car-price">₹{car.pricePerDay.toLocaleString()}/day</p>
                      
                      <div className="car-features">
                        <div className="feature">
                          <FiClock className="feature-icon" />
                          <span>{car.modelYear}</span>
                        </div>
                        <div className="feature">
                          <FiDroplet className="feature-icon" />
                          <span>{car.fuelType}</span>
                        </div>
                        <div className="feature">
                          <FiUsers className="feature-icon" />
                          <span>{car.seatingCapacity} Seats</span>
                        </div>
                      </div>
                      
                      <button 
                        className="view-details-btn"
                        onClick={() => navigate(`/car-details/${car._id}`)}
                      >
                        View Details <FiArrowRight className="btn-icon" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {visibleCars < cars.length && (
              <div className="load-more-container">
                <button className="load-more-btn" onClick={loadMoreCars}>
                  Show More Vehicles
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <style jsx>{`
        .car-listing-page {
          background-color: #f8fafc;
          min-height: 100vh;
        }

        .hero-section {
          background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), 
                      url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80');
          background-size: cover;
          background-position: center;
          height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: white;
          margin-bottom: 3rem;
        }

        .hero-content {
          max-width: 800px;
          padding: 0 2rem;
        }

        .hero-title {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 1rem;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .hero-subtitle {
          font-size: 1.25rem;
          opacity: 0.9;
          margin-bottom: 2rem;
        }

        .car-listing-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem 4rem;
        }

        .loading-spinner {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 0;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 5px solid #f3f3f3;
          border-top: 5px solid #6366f1;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-message {
          text-align: center;
          padding: 4rem 0;
          color: #ef4444;
          font-size: 1.25rem;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 0;
          color: #64748b;
        }

        .empty-state h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: #334155;
        }

        .car-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 2rem;
        }

        .car-card {
          background-color: white;
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }

        .car-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        .car-image-container {
          position: relative;
          height: 220px;
          overflow: hidden;
        }

        .car-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .car-card:hover .car-image {
          transform: scale(1.05);
        }

        .car-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background-color: #10b981;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .car-content {
          padding: 1.5rem;
        }

        .car-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.5rem;
        }

        .car-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .car-rating {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          background-color: #f8fafc;
          padding: 0.25rem 0.5rem;
          border-radius: 9999px;
          font-size: 0.875rem;
          color: #334155;
        }

        .star-icon {
          color: #f59e0b;
          font-size: 0.875rem;
        }

        .car-price {
          font-size: 1.5rem;
          font-weight: 700;
          color: #6366f1;
          margin-bottom: 1rem;
        }

        .car-features {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .feature {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.875rem;
          color: #64748b;
        }

        .feature-icon {
          color: #94a3b8;
        }

        .view-details-btn {
          width: 100%;
          padding: 0.75rem;
          background-color: #6366f1;
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .view-details-btn:hover {
          background-color: #4f46e5;
        }

        .btn-icon {
          transition: transform 0.2s ease;
        }

        .view-details-btn:hover .btn-icon {
          transform: translateX(3px);
        }

        .load-more-container {
          display: flex;
          justify-content: center;
          margin-top: 3rem;
        }

        .load-more-btn {
          padding: 0.75rem 1.5rem;
          background-color: white;
          color: #6366f1;
          border: 1px solid #6366f1;
          border-radius: 0.5rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .load-more-btn:hover {
          background-color: #6366f1;
          color: white;
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2rem;
          }

          .hero-subtitle {
            font-size: 1rem;
          }

          .car-grid {
            grid-template-columns: 1fr;
          }

          .car-listing-container {
            padding: 0 1rem 2rem;
          }
        }
      `}</style>
    </div>
  );
}