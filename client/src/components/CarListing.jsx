import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const BASE_URL = "https://car-rental-portal-backend.onrender.com";

// Reusable function to handle image URLs
const getImageUrl = (images) => {
  return images?.length
    ? `${BASE_URL}${images[0].startsWith("/") ? images[0] : "/" + images[0]}`
    : "https://via.placeholder.com/300x200?text=No+Image";
};

export default function CarListing() {
  const [cars, setCars] = useState([]);
  const [brands, setBrands] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    brand: "",
    fuelType: "",
    seatingCapacity: "",
  });
  const [sortOption, setSortOption] = useState("price-asc");
  const [activeFilter, setActiveFilter] = useState(null);
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
      } finally {
        setLoading(false);
      }
    };

    const fetchBrands = async () => {
      try {
        const response = await fetch(`${BASE_URL}/allbrands`);
        if (!response.ok) throw new Error("Failed to fetch brands");
        const data = await response.json();
        setBrands(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchVehicles();
    fetchBrands();
  }, []);

  const filteredCars = cars.filter((car) => {
    const { brand, fuelType, seatingCapacity } = filters;
    return (
      (!brand || car.brand === brand) &&
      (!fuelType || car.fuelType === fuelType) &&
      (!seatingCapacity || car.seatingCapacity === seatingCapacity)
    );
  });

  const sortedCars = [...filteredCars].sort((a, b) => {
    switch (sortOption) {
      case "price-asc":
        return a.pricePerDay - b.pricePerDay;
      case "price-desc":
        return b.pricePerDay - a.pricePerDay;
      case "year-asc":
        return a.modelYear - b.modelYear;
      case "year-desc":
        return b.modelYear - a.modelYear;
      default:
        return 0;
    }
  });

  const resetFilters = () => {
    setFilters({
      brand: "",
      fuelType: "",
      seatingCapacity: "",
    });
    setSortOption("price-asc");
  };

  return (
    <>
      <Header />
      <main className="car-listing-container">
        <div className="hero-section">
          <div className="hero-content">
            <h1 className="heading">Find Your Perfect Ride</h1>
            <p className="subheading">
              Choose from our premium collection of vehicles
            </p>
          </div>
        </div>

        {loading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading vehicles...</p>
          </div>
        )}
        
        {error && (
          <div className="error-message">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && cars.length === 0 && (
          <div className="no-cars-message">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <p>No cars available at the moment. Please check back later.</p>
          </div>
        )}

        {!loading && !error && cars.length > 0 && (
          <div className="content-wrapper">
            <div className="mobile-filters-toggle" onClick={() => setActiveFilter(activeFilter ? null : 'filters')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="21" x2="4" y2="14"></line>
                <line x1="4" y1="10" x2="4" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12" y2="3"></line>
                <line x1="20" y1="21" x2="20" y2="16"></line>
                <line x1="20" y1="12" x2="20" y2="3"></line>
                <line x1="1" y1="14" x2="7" y2="14"></line>
                <line x1="9" y1="8" x2="15" y2="8"></line>
                <line x1="17" y1="16" x2="23" y2="16"></line>
              </svg>
              <span>Filters</span>
            </div>

            <div className={`layout ${activeFilter === 'filters' ? 'mobile-active' : ''}`}>
              {/* Left Side - Filter and Sort */}
              <aside className="filter-sort">
                <div className="filter-header">
                  <h2 className="section-title">Filters</h2>
                  <button className="reset-btn" onClick={resetFilters}>
                    Reset All
                  </button>
                </div>

                {/* Filter Section */}
                <div className="filter-section">
                  <div className="filter-group">
                    <label>Brand</label>
                    <select
                      value={filters.brand}
                      onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
                    >
                      <option value="">All Brands</option>
                      {brands.map((brand) => (
                        <option key={brand._id} value={brand.name}>
                          {brand.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="filter-group">
                    <label>Fuel Type</label>
                    <div className="filter-options">
                      {['Petrol', 'Diesel', 'Electric', 'Hybrid'].map((type) => (
                        <button
                          key={type}
                          className={`filter-option ${filters.fuelType === type ? 'active' : ''}`}
                          onClick={() => setFilters({ ...filters, fuelType: filters.fuelType === type ? '' : type })}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="filter-group">
                    <label>Seating Capacity</label>
                    <div className="filter-options">
                      {['4', '5', '7', '8+'].map((capacity) => (
                        <button
                          key={capacity}
                          className={`filter-option ${filters.seatingCapacity === capacity ? 'active' : ''}`}
                          onClick={() => setFilters({ ...filters, seatingCapacity: filters.seatingCapacity === capacity ? '' : capacity })}
                        >
                          {capacity} {capacity === '8+' ? '' : 'Seats'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sort Section */}
                <div className="sort-section">
                  <h2 className="section-title">Sort By</h2>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                  >
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="year-asc">Model Year: Old to New</option>
                    <option value="year-desc">Model Year: New to Old</option>
                  </select>
                </div>
              </aside>

              {/* Right Side - Car Listing */}
              <section className="all-cars">
                <div className="results-header">
                  <h3>
                    {sortedCars.length} {sortedCars.length === 1 ? 'Car' : 'Cars'} Available
                  </h3>
                  <div className="active-filters">
                    {filters.brand && (
                      <span className="active-filter">
                        {filters.brand}
                        <button onClick={() => setFilters({ ...filters, brand: '' })}>
                          ×
                        </button>
                      </span>
                    )}
                    {filters.fuelType && (
                      <span className="active-filter">
                        {filters.fuelType}
                        <button onClick={() => setFilters({ ...filters, fuelType: '' })}>
                          ×
                        </button>
                      </span>
                    )}
                    {filters.seatingCapacity && (
                      <span className="active-filter">
                        {filters.seatingCapacity} Seats
                        <button onClick={() => setFilters({ ...filters, seatingCapacity: '' })}>
                          ×
                        </button>
                      </span>
                    )}
                  </div>
                </div>

                <div className="car-grid">
                  {sortedCars.map(({ _id, images, title, pricePerDay, brand, modelYear, fuelType, seatingCapacity }) => {
                    const imageUrl = getImageUrl(images);

                    return (
                      <div key={_id} className="car-card">
                        <div className="car-image-container">
                          <img src={imageUrl} alt={title} className="car-image" />
                          <div className="car-badge">{brand}</div>
                        </div>
                        <div className="car-info">
                          <h2 className="car-name">{title}</h2>
                          <div className="car-specs">
                            <span>
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                              </svg>
                              {modelYear}
                            </span>
                            <span>
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5.52 19c.64-2.2 1.84-3 3.22-3h6.52c1.38 0 2.58.8 3.22 3"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                                <circle cx="12" cy="12" r="10"></circle>
                              </svg>
                              {seatingCapacity} Seats
                            </span>
                            <span>
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                                <line x1="6" y1="1" x2="6" y2="4"></line>
                                <line x1="10" y1="1" x2="10" y2="4"></line>
                                <line x1="14" y1="1" x2="14" y2="4"></line>
                              </svg>
                              {fuelType}
                            </span>
                          </div>
                          <div className="car-footer">
                            <div className="price">
                              <span className="price-amount">₹{pricePerDay}</span>
                              <span className="price-label">/day</span>
                            </div>
                            <button
                              className="view-details-btn"
                              onClick={() => navigate(`/car-details/${_id}`)}
                            >
                              Book Now
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          </div>
        )}
      </main>
      <Footer />

      {/* Embedded CSS */}
      <style>{`
        :root {
          --primary-color: #2563eb;
          --primary-hover: #1d4ed8;
          --secondary-color: #6b7280;
          --light-gray: #f3f4f6;
          --dark-gray: #374151;
          --white: #ffffff;
          --black: #111827;
          --red: #ef4444;
          --green: #10b981;
          --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          --shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
          --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          --rounded-sm: 0.125rem;
          --rounded: 0.25rem;
          --rounded-md: 0.375rem;
          --rounded-lg: 0.5rem;
          --rounded-xl: 0.75rem;
          --rounded-full: 9999px;
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          line-height: 1.5;
          color: var(--black);
          background-color: var(--white);
        }

        .car-listing-container {
          padding: 0;
          max-width: 100%;
          margin: 0 auto;
          background: var(--white);
        }

        .hero-section {
          background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), 
                      url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80');
          background-size: cover;
          background-position: center;
          height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--white);
          text-align: center;
          padding: 0 20px;
          margin-bottom: 40px;
        }

        .hero-content {
          max-width: 800px;
        }

        .heading {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
          letter-spacing: -0.025em;
        }

        .subheading {
          font-size: 1.25rem;
          font-weight: 400;
          opacity: 0.9;
        }

        .content-wrapper {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .mobile-filters-toggle {
          display: none;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: var(--primary-color);
          color: white;
          border-radius: var(--rounded-md);
          margin-bottom: 20px;
          cursor: pointer;
          font-weight: 500;
        }

        .mobile-filters-toggle svg {
          width: 18px;
          height: 18px;
        }

        .layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 32px;
          align-items: start;
        }

        .filter-sort {
          background: var(--white);
          padding: 24px;
          border-radius: var(--rounded-lg);
          box-shadow: var(--shadow-md);
          position: sticky;
          top: 20px;
        }

        .filter-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .section-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--black);
          margin-bottom: 16px;
        }

        .reset-btn {
          background: none;
          border: none;
          color: var(--primary-color);
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: var(--rounded-sm);
        }

        .reset-btn:hover {
          background: var(--light-gray);
        }

        .filter-group {
          margin-bottom: 24px;
        }

        .filter-group label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--dark-gray);
          margin-bottom: 8px;
        }

        .filter-group select {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #e5e7eb;
          border-radius: var(--rounded-md);
          background: var(--white);
          font-size: 0.875rem;
          color: var(--black);
          transition: border-color 0.2s;
        }

        .filter-group select:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .filter-options {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .filter-option {
          padding: 6px 12px;
          background: var(--light-gray);
          border: none;
          border-radius: var(--rounded-full);
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--dark-gray);
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-option:hover {
          background: #e5e7eb;
        }

        .filter-option.active {
          background: var(--primary-color);
          color: var(--white);
        }

        .sort-section {
          margin-top: 32px;
        }

        .all-cars {
          width: 100%;
        }

        .results-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e5e7eb;
        }

        .results-header h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--dark-gray);
        }

        .active-filters {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .active-filter {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          background: var(--light-gray);
          border-radius: var(--rounded-full);
          font-size: 0.75rem;
          font-weight: 500;
        }

        .active-filter button {
          background: none;
          border: none;
          color: var(--secondary-color);
          cursor: pointer;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          padding: 0;
        }

        .car-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
        }

        .car-card {
          border-radius: var(--rounded-lg);
          overflow: hidden;
          background: var(--white);
          box-shadow: var(--shadow);
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
        }

        .car-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }

        .car-image-container {
          position: relative;
          width: 100%;
          height: 180px;
          overflow: hidden;
        }

        .car-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .car-card:hover .car-image {
          transform: scale(1.05);
        }

        .car-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(0, 0, 0, 0.7);
          color: var(--white);
          padding: 4px 10px;
          border-radius: var(--rounded-full);
          font-size: 0.75rem;
          font-weight: 500;
        }

        .car-info {
          padding: 16px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .car-name {
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 8px;
          color: var(--black);
        }

        .car-specs {
          display: flex;
          gap: 12px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .car-specs span {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
          color: var(--secondary-color);
        }

        .car-specs svg {
          width: 14px;
          height: 14px;
          opacity: 0.7;
        }

        .car-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
        }

        .price {
          display: flex;
          align-items: baseline;
          gap: 2px;
        }

        .price-amount {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--primary-color);
        }

        .price-label {
          font-size: 0.75rem;
          color: var(--secondary-color);
        }

        .view-details-btn {
          background: var(--primary-color);
          color: var(--white);
          padding: 8px 16px;
          font-size: 0.875rem;
          font-weight: 500;
          border: none;
          border-radius: var(--rounded-md);
          cursor: pointer;
          transition: background 0.2s;
          white-space: nowrap;
        }

        .view-details-btn:hover {
          background: var(--primary-hover);
        }

        .loading-spinner {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          padding: 60px 0;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-left-color: var(--primary-color);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .loading-spinner p {
          color: var(--dark-gray);
          font-size: 1rem;
        }

        .no-cars-message,
        .error-message {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 60px 20px;
          text-align: center;
          max-width: 600px;
          margin: 0 auto;
        }

        .no-cars-message svg,
        .error-message svg {
          width: 48px;
          height: 48px;
          color: var(--secondary-color);
        }

        .no-cars-message p,
        .error-message p {
          font-size: 1.125rem;
          color: var(--dark-gray);
        }

        .error-message svg {
          color: var(--red);
        }

        .error-message p {
          color: var(--red);
        }

        @media (max-width: 1024px) {
          .layout {
            grid-template-columns: 240px 1fr;
            gap: 24px;
          }
        }

        @media (max-width: 768px) {
          .mobile-filters-toggle {
            display: flex;
          }

          .layout {
            grid-template-columns: 1fr;
          }

          .filter-sort {
            display: none;
            position: static;
            margin-bottom: 24px;
          }

          .layout.mobile-active .filter-sort {
            display: block;
          }

          .hero-section {
            height: 240px;
          }

          .heading {
            font-size: 2rem;
          }

          .subheading {
            font-size: 1rem;
          }
        }

        @media (max-width: 480px) {
          .car-grid {
            grid-template-columns: 1fr;
          }

          .results-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .active-filters {
            width: 100%;
          }

          .hero-section {
            height: 200px;
          }
        }
      `}</style>
    </>
  );
}
