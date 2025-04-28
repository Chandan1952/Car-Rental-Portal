import React from "react";
import Header from "./Header";
import CarListings from "./CarListings";
import Discover from "./Discover";
import Footer from "./Footer";
import Testimonials from "./Testimonials";


const UserDashboard = () => {
  return (
    <div>
      {/* Header Section */}
      <Header />

      {/* Discover Section */}
      <Discover />

      {/* Car Listings Section */}
      <CarListings />
      <Testimonials></Testimonials>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default UserDashboard;
