import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import About from "./components/About";
import FAQs from "./components/FAQs";
import ContactUs from "./components/ContactUs";
import CarListing from "./components/CarListing";
import UserDashboard from "./components/UserDashboard";
import UserChangePassword from "./components/UserChangePassword";
import UserProfilePage from "./components/UserProfilePage";
import UserMyBooking from "./components/UserMyBooking";
import UserPostTestimonial from "./components/UserPostTestimonial";
import UserMyTestimonials from "./components/UserMyTestimonials";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import AdminPostVehicle from "./components/AdminPostVehicle";
import AdminManageVehicles from "./components/AdminManageVehicles ";
import CreateBrand from "./components/AdminCreateBrand";
import ManageBrands from "./components/AdminManageBrand";
import ManageBookings from "./components/AdminManageBookings";
import CarDetails from "./components/CarDetails";
import ResetPassword from "./components/ResetPassword";
import ManageTestimonials from "./components/AdminManageTestimonial";
import ForgotPassword from "./components/ForgotPassword";
import AdminManageUsers from "./components/AdminManageUsers";
import ManageSubscriptions from "./components/AdminManageSubscriptions ";
import UpdateContactInfo from "./components/AdminUpdateContactInfo ";
import ManageQueries from "./components/AdminManageQueries";
import AdminEditVehicle from "./components/AdminEditVehicle";
import AdminEditUser from "./components/AdminEditUser";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsOfUse from "./components/TermsOfUse";
import AdminFAQs from "./components/AdminManageFAQs";









function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/car-listing" element={<CarListing />} />
        <Route path="/faqs" element={<FAQs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/car-details/:id" element={<CarDetails />} />
        <Route path="/forget-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfUse />} />





        




        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/profile-settings" element={<UserProfilePage />} />
        <Route path="/update-password" element={<UserChangePassword />} />
        <Route path="/my-booking" element={<UserMyBooking />} />
        <Route path="/post-testimonial" element={<UserPostTestimonial />} />
        <Route path="/my-testimonial" element={<UserMyTestimonials />} />



        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-postvehicle" element={<AdminPostVehicle />} />
        <Route path="/admin-managevehicle" element={<AdminManageVehicles />} />
        <Route path="/admin-createbrands" element={<CreateBrand />} />
        <Route path="/admin-managebrands" element={<ManageBrands />} />
        <Route path="/admin-managebookings" element={<ManageBookings />} />
        <Route path="/admin-managetestimonials" element={<ManageTestimonials />} />
        <Route path="/admin-manageusers" element={<AdminManageUsers />} />
        <Route path="/admin-managesubscriptions" element={<ManageSubscriptions />} />
        <Route path="/admin-updatedcontactinfo" element={<UpdateContactInfo />} />
        <Route path="/admin-managequery" element={<ManageQueries />} />
        <Route path="/admin/edit-vehicle/:id" element={<AdminEditVehicle />} />
        <Route path="/admin-edit-user/:id" element={<AdminEditUser />} />
        <Route path="/admin-managefaqs" element={<AdminFAQs />} />





















        



        


      







        


      </Routes>
    </Router>
  );
}

export default App;
