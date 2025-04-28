import React from "react";
import Header from "./Header";
import CarListings from "./CarListings";
import Discover from "./Discover";
import Footer from "./Footer";
import Testimonials from "./Testimonials";
import CarRentalHomePage from "./CarRentalHomePage";
import HowToBook from "./HowToBook";


const Home = () => {
  return (
    <div>
      <Header />
      <Discover></Discover>
      <CarListings />
      <HowToBook></HowToBook>
      <CarRentalHomePage />

      <Testimonials></Testimonials>

      <Footer></Footer>
    </div>
  );
};

export default Home;
