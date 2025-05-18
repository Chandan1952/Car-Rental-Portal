require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const app = express();

// ✅ CORS Setup
app.use(
  cors({
    origin: "https://car-rental-portal-client.onrender.com", // Use HTTP, not HTTPS
    credentials: true,
  })
);


// ✅ Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ✅ Session Middleware (MongoDB Store)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "yourSecretKey",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
      ttl: 14 * 24 * 60 * 60, // 14 days
    }),
    cookie: { secure: false },
  })
);

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// mongoose.connect("mongodb+srv://chandan1952:Chandan%401596@cluster0.dnvhw.mongodb.net/car-rental-portal?retryWrites=true&w=majority")
//   .then(() => console.log("✅ Connected to MongoDB"))
//   .catch((err) => console.error("❌ MongoDB Connection Error:", err));



//********************REGISTRATION-AND-FORGET-PASSWORD-PAGE************************


// Using Schema Value in form "Sign-up" Page
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    registrationDate: { type: Date, default: Date.now },
    dob: String,
    address: String,
    country: String,
    city: String,
  })
);


// Route: Handle "Sign-Up" Form Submission
app.post("/submit", async function (req, res) {
  const { fullName, email, phone, password, confirmPassword } = req.body;

  try {
    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered." });
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match." });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the new user
    const newUser = new User({
      fullName,
      email,
      phone,
      password: hashedPassword, // Store encrypted password
      dob: "",
      address: "",
      country: "",
      city: "",
    });

    await newUser.save();
    req.session.userId = newUser._id; // Save user session

    res.status(201).json({ message: "User registered successfully", userId: newUser._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred during registration. Please try again." });
  }
});



// Route to handle "Forgot-Password" form submissions
app.post('/forgot-password', async function (req, res) {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ error: 'No account found with this email.' });
    }

    // Instead of sending an email, redirect user to password reset form
    return res.json({ success: true, redirectUrl: `/reset-password?email=${email}` });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error processing password reset request.' });
  }
});


// Route to handle "Reset-Password" form submissions
app.post('/reset-password', async function (req, res) {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ error: 'Email and new password are required' });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ error: 'No account found with this email.' });
    }

    // Hash the new password before saving
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    existingUser.password = hashedPassword;
    await existingUser.save();

    return res.json({ success: true, message: 'Password updated successfully. You can now log in.' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error updating password.' });
  }
});

//***********************************************************************





//**************************USER-DASHBOARD-PAGE************************


// Route for handling "User-login" form submissions
app.post('/user-login', async function (req, res) {
  const { email, password } = req.body;

  try {
    // Input Validation
    if (!email || !password) {
      return res.status(400).json({ status: 'error', message: 'Email and password are required.' });
    }

    // Find user by email
    const foundUser = await User.findOne({ email });

    // If user not found
    if (!foundUser) {
      return res.status(400).json({ status: 'error', message: 'Email not found.' });
    }

    // Verify password
    const isPasswordMatch = await bcrypt.compare(password, foundUser.password);

    if (!isPasswordMatch) {
      return res.status(400).json({ status: 'error', message: 'Incorrect password.' });
    }

    // Successful login
    req.session.userId = foundUser._id; // Store user ID in session
    req.session.username = foundUser.fullName; // Store user ID in session
    req.session.userEmail = foundUser.email;

    // Send success response
    res.status(200).json({ status: 'success', message: 'Login successful', userId: foundUser._id, userEmail: foundUser.email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'An error occurred. Please try again.' });
  }
});



// 🔹 GET USER DETAILS (Authenticated)
app.get("/api/user", async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: "Unauthorized. Please log in." });

  try {
    const user = await User.findById(req.session.userId).select("-password");
    if (!user) return res.status(404).json({ error: "User not found." });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Error fetching user details." });
  }
});


// Route for handling "User-Change-Password" form submissions
app.put("/api/change-password", async (req, res) => {
  const { oldPassword, newPassword } = req.body; // Ensure field names match frontend
  const userId = req.session.userId; // Get logged-in user ID

  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: "Current password is incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ success: "Password changed successfully!" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});




// Route to "User Logout" Page
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    // Clear the session cookie
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Logged out successfully" });
  });
});




//*********************ADMIN-DASHBOARD-PAGE************************


// **Hardcoded Admin Credentials** (For Development Only)
const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "admin";


// **Admin-Login Route**
app.post("/admin-login", (req, res) => {
  const { email, password } = req.body;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    req.session.adminEmail = email; // Store admin session
    return res.status(200).json({ message: "Login successful" });
  } else {
    return res.status(401).json({ error: "Invalid credentials" });
  }
});


// **Admin-Details-Authentication**
app.get("/api/admin", (req, res) => {
  // Simulating an authenticated admin (Replace with real authentication)
  const adminDetails = { name: "Admin", email: "admin@gmail.com" };
  res.json(adminDetails);
});


// **Admin-Session-Verification**
app.get("/admin-verify", (req, res) => {
  if (req.session.adminEmail === ADMIN_EMAIL) {
    return res.json({ isAdmin: true, email: ADMIN_EMAIL });
  }
  return res.status(401).json({ error: "Unauthorized" });
});


// **Admin-Dashboard-Statistics**
app.get("/admin-dashboard", async (req, res) => {
  if (req.session.adminEmail !== ADMIN_EMAIL) {
    return res.status(401).json({ error: "Unauthorized access" });
  }
  try {
    const regUsers = await User.countDocuments();
    const listedVehicles = await Vehicle.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const listedBrands = await Brand.countDocuments();
    const subscribers = await Subscription.countDocuments();
    const queries = await Query.countDocuments();
    const testimonials = await Testimonial.countDocuments();

    res.json({
      stats: {
        regUsers,
        listedVehicles,
        totalBookings,
        listedBrands,
        subscribers,
        queries,
        testimonials,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Error fetching data" });
  }
});

// Booking Monthly Statistics
app.get("/booking-stats", async (req, res) => {
  if (req.session.adminEmail !== ADMIN_EMAIL) {
    return res.status(401).json({ error: "Unauthorized access" });
  }
  try {
    const bookings = await Booking.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const monthlyStats = months.map((name, index) => {
      const found = bookings.find(b => b._id === index + 1);
      return { name, bookings: found ? found.count : 0 };
    });

    res.json({ monthlyStats });
  } catch (error) {
    console.error("Error fetching booking stats:", error);
    res.status(500).json({ message: "Error fetching monthly stats" });
  }
});


// **Admin Logout**
app.post("/admin-logout", (req, res) => {
  req.session.destroy();
  res.json({ message: "Logged out successfully" });
});





//*********************ADMIN-Manage-User-Profile************************


// **Admin-Manage-User**
app.get("/admin-manageprofile", async (req, res) => {
  if (req.session.adminEmail !== ADMIN_EMAIL) {
    return res.status(403).json({ error: "Unauthorized access" });
  }

  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);

    const totalUsers = await User.countDocuments();
    const users = await User.find().skip((pageNumber - 1) * pageSize).limit(pageSize);

    res.json({ users, totalUsers, totalPages: Math.ceil(totalUsers / pageSize), currentPage: pageNumber });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});



//admin edit user
app.get("/get-user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});


app.put("/update-user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// DELETE a user by ID (No Authentication)
app.delete("/delete/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
});

//*******************************************************************************











//*********************ADMIN-POST-AND-MANAGE-VEHICLES-PAGE************************

const vehicleSchema = new mongoose.Schema({
  title: String,
  overview: String,
  brand: String,
  fuelType: String,
  pricePerDay: Number,
  modelYear: Number,
  seatingCapacity: Number,
  accessories: [String],
  images: [String],
}, {
  timestamps: true // 👈 adds createdAt and updatedAt fields automatically
});

const Vehicle = mongoose.model("Vehicle", vehicleSchema);


// Ensure "uploads" folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save files in "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage });

// Serve static images
app.use("/uploads", express.static(uploadDir));



// Post a Vehicle
app.post("/api/vehicles", upload.array("images", 5), async (req, res) => {
  try {
    const { title, overview, brand, fuelType, pricePerDay, modelYear, seatingCapacity, accessories } = req.body;

    // Convert uploaded image filenames to URLs
    const images = req.files.map((file) => `/uploads/${file.filename}`);

    // Safely parse accessories array (handles both JSON and plain string input)
    let parsedAccessories;
    try {
      parsedAccessories = typeof accessories === "string" ? JSON.parse(accessories) : accessories;
    } catch (error) {
      return res.status(400).json({ message: "Invalid accessories format" });
    }

    // Validate required fields
    if (!title || !brand || !fuelType || !pricePerDay || !modelYear || !seatingCapacity) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create new vehicle entry
    const newVehicle = new Vehicle({
      title,
      overview,
      brand,
      fuelType,
      pricePerDay,
      modelYear,
      seatingCapacity,
      accessories: parsedAccessories || [],
      images,
    });

    // Save to MongoDB
    await newVehicle.save();
    res.json({ message: "✅ Vehicle posted successfully", vehicle: newVehicle });
  } catch (error) {
    console.error("❌ Error posting vehicle:", error);
    res.status(500).json({ message: "❌ Error posting vehicle", error });
  }
});


// ✅ Upload Image API
app.post("/api/upload", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const imageUrl = `/uploads/${req.file.filename}`; // Relative path
  res.json({ imageUrl });
});


// ✅ Get All Vehicles API
app.get("/api/vehiclesdetails", async (req, res) => {
  try {
    const vehicles = await Vehicle.find().sort({ createdAt: -1 }); // ⬅️ sort newest first
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});


// Get Single Vehicle by ID
app.get("/api/vehicles/:id", async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});


// Update Vehicle (with Image Uploads)
app.put("/api/vehicles/:id", upload.array("images", 5), async (req, res) => {
  try {
    const { title, brand, fuelType, accessories, overview, pricePerDay, modelYear, seatingCapacity, existingImages } = req.body;

    let updatedFields = {
      title, brand, fuelType, overview, pricePerDay, modelYear, seatingCapacity,
    };

    if (accessories) {
      try {
        updatedFields.accessories = typeof accessories === "string" ? JSON.parse(accessories) : accessories;
      } catch (err) {
        return res.status(400).json({ error: "Invalid accessories format" });
      }
    }

    let newImages = [];
    if (req.files.length > 0) {
      newImages = req.files.map(file => `/uploads/${file.filename}`);
    }

    updatedFields.images = [...(existingImages ? JSON.parse(existingImages) : []), ...newImages];

    const updatedVehicle = await Vehicle.findByIdAndUpdate(req.params.id, updatedFields, { new: true });

    if (!updatedVehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    res.json({ message: "Vehicle updated successfully", updatedVehicle });
  } catch (error) {
    console.error("Error updating vehicle:", error);
    res.status(500).json({ error: "Error updating vehicle" });
  }
});



// 📌 Delete a vehicle
app.delete("/api/delete/:id", async (req, res) => {
  try {
    await Vehicle.findByIdAndDelete(req.params.id);
    res.json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting vehicle", error });
  }
});


// Get car details by ID
app.get("/api/car-details/:id", async (req, res) => {
  try {
    const car = await Vehicle.findById(req.params.id); // Fetch from database
    if (!car) return res.status(404).json({ message: "Car not found" });
    res.json(car);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


//*************************************************************************






//*********************ADMIN-BRANDS-AND-MANAGE-BRANDS-PAGE************************

const BrandSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true } // This will automatically add `createdAt` and `updatedAt`
);


const Brand = mongoose.model("Brand", BrandSchema);


// Add a new brand
app.post("/brands", async (req, res) => {
  try {
    const { name } = req.body;
    const newBrand = new Brand({ name });
    await newBrand.save();
    res.status(201).json(newBrand);
  } catch (error) {
    res.status(500).json({ message: "Error adding brand", error });
  }
});

// Get all brands
app.get("/allbrands", async (req, res) => {
  try {
    const brands = await Brand.find();
    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: "Error fetching brands", error });
  }
});



// ✅ Delete a brand
app.delete("/api/brands/:id", async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }
    await Brand.findByIdAndDelete(req.params.id);
    res.json({ message: "Brand deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting brand", error });
  }
});

// Update a brand by ID
app.put("/api/brands/:id", async (req, res) => {
  try {
    const { name } = req.body;
    const updatedBrand = await Brand.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true } // Return updated document
    );
    if (!updatedBrand) {
      return res.status(404).json({ message: "Brand not found" });
    }
    res.json(updatedBrand);
  } catch (error) {
    res.status(500).json({ message: "Error updating brand", error });
  }
});

//*************************************************************************




// ******************************TESTIMONIAL-PAGE*************************************


// Define Testimonial Schema
const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  testimonial: { type: String, required: true },
  date: { type: Date, default: Date.now },
  approved: { type: Boolean, default: false }, // ✅ Using boolean for approval status
});

const Testimonial = mongoose.model("Testimonial", testimonialSchema);

// Middleware: Ensure User is Authenticated
const isAuthenticated = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

// API: Post a New Testimonial (Requires Authentication)
app.post("/api/testimonials", isAuthenticated, async (req, res) => {
  try {
    const { testimonial } = req.body;
    if (!testimonial || testimonial.length < 10) {
      return res.status(400).json({ message: "Testimonial must be at least 10 characters long." });
    }

    const newTestimonial = new Testimonial({
      name: req.session.username,
      email: req.session.userEmail,
      testimonial,
    });

    await newTestimonial.save();
    res.status(201).json({ message: "Testimonial submitted successfully!", testimonial: newTestimonial });
  } catch (error) {
    console.error("Error submitting testimonial:", error);
    res.status(500).json({ message: "Error submitting testimonial" });
  }
});



// API: Get Testimonials for Logged-in User
app.get("/api/mytestimonials", async (req, res) => {
  try {
    // Ensure user is logged in
    if (!req.session || !req.session.userEmail) {
      return res.status(401).json({ message: "Unauthorized: Please log in" });
    }

    // Fetch testimonials for the logged-in user
    const testimonials = await Testimonial.find({ email: req.session.userEmail });

    res.json(testimonials);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    res.status(500).json({ message: "Database fetch error" });
  }
});


// GET all testimonials (Admin View)
app.get("/api/admin/testimonials", async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch testimonials" });
  }
});

// PATCH: Admin approves or disapproves a testimonial
app.patch("/api/admin/testimonials/:id/approve", async (req, res) => {
  try {
    const { approved } = req.body; // Expecting true/false

    if (typeof approved !== "boolean") {
      return res.status(400).json({ error: "Invalid approved value" });
    }

    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { approved }, // Directly update with boolean
      { new: true }
    );

    if (!updatedTestimonial) {
      return res.status(404).json({ error: "Testimonial not found" });
    }

    res.json({ message: `Testimonial updated successfully`, updatedTestimonial });
  } catch (err) {
    console.error("Error updating testimonial status:", err);
    res.status(500).json({ error: "Failed to update testimonial status" });
  }
});

// Delete : Testimonials User
app.delete("/api/mytestimonials/:id", async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ error: "Testimonial not found" });
    }

    res.json({ message: "Testimonial deleted successfully" });
  } catch (err) {
    console.error("Error deleting testimonial:", err);
    res.status(500).json({ error: "Failed to delete testimonial" });
  }
});



// API route to get only approved testimonials
app.get("/testimonials", async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ approved: true });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch testimonials" });
  }
});



// *****************************************************************************************





// *****************************NEWS-SUBSCRIPTIONS-PAGE**************************************

const subscriptionSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  subscribedAt: { type: Date, default: Date.now },
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

// Subscribe a new email
app.post("/subscribe", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const existingSubscription = await Subscription.findOne({ email });
    if (existingSubscription) {
      return res.status(400).json({ message: "Email is already subscribed" });
    }

    const newSubscription = new Subscription({ email });
    await newSubscription.save();
    res.status(201).json({ message: "Subscription successful!" });
  } catch (error) {
    res.status(500).json({ message: "Error saving subscription" });
  }
});

// Fetch all subscriptions
app.get("/subscriptions", async (req, res) => {
  try {
    const subscriptions = await Subscription.find();
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching subscriptions" });
  }
});

// Delete a subscription (Unsubscribe)
app.delete("/subscriptions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSubscription = await Subscription.findByIdAndDelete(id);
    if (!deletedSubscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }
    res.json({ message: "Subscription deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting subscription" });
  }
});

// *******************************************************************





// **************************CONTACT-UPDATED-PAGE*****************************************


let contactDetails = {
  email: "support@carrentalportal.com",
  phone: "+91-9876-5432-1",
  address: "456 New Car Rental Street, Mumbai, India",
};

// GET request to fetch contact details
app.get("/contact-details", (req, res) => {
  res.json(contactDetails);
});

// POST request to update contact details
app.post("/update-contact", (req, res) => {
  contactDetails = req.body;
  res.json({ message: "Contact details updated successfully!" });
});


// *******************************************************************




// ****************************QUERY-MANAGE-PAGE***************************************


const querySchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  date: { type: Date, default: Date.now },
  status: { type: String, default: "Pending" }, // Added status field
});

const Query = mongoose.model("Query", querySchema);

// Save user queries
app.post("/api/queries", async (req, res) => {
  try {
    const newQuery = new Query(req.body);
    await newQuery.save();
    res.status(201).json({ message: "Query saved successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to save query" });
  }
});

// Fetch all queries for admin
app.get("/api/allqueries", async (req, res) => {
  try {
    const queries = await Query.find().sort({ date: -1 });
    res.status(200).json(queries);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch queries" });
  }
});

// Update query status
app.put("/api/query/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const updatedQuery = await Query.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.status(200).json(updatedQuery);
  } catch (error) {
    res.status(500).json({ error: "Failed to update query status" });
  }
});


// **********************************************************************************




// *****************************MANAGE-FAQS-PAGES**************************************

const faqSchema = new mongoose.Schema({
  question: String,
  answer: String,
});

const FAQ = mongoose.model("FAQ", faqSchema);

// Get FAQs
app.get("/api/faqs", async (req, res) => {
  const faqs = await FAQ.find();
  res.json(faqs);
});

// Add or Update FAQ
app.post("/api/faqs", async (req, res) => {
  const { id, question, answer } = req.body;

  if (id) {
    await FAQ.findByIdAndUpdate(id, { question, answer });
    res.json({ message: "FAQ updated successfully!" });
  } else {
    const newFAQ = new FAQ({ question, answer });
    await newFAQ.save();
    res.json({ message: "FAQ added successfully!" });
  }
});

// Delete FAQ
app.delete("/api/faqs/:id", async (req, res) => {
  await FAQ.findByIdAndDelete(req.params.id);
  res.json({ message: "FAQ deleted successfully!" });
});


// ******************************************************************************






// ************************BOOKING-PAGES*******************************************


// Define Booking Schema
const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  carId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  location: { type: String, required: true },
  status: { type: String, default: "Pending" },
  paymentId: { type: String }, // "COD" or Razorpay payment id
  amount: { type: Number, required: true }, // 💰 Total paid
  createdAt: { type: Date, default: Date.now },
});

const Booking = mongoose.model("Booking", bookingSchema);



app.get("/api/userid", (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "User not logged in" });
  }
  res.json({ id: req.session.userId });
});

// Razorpay instance
const razorpay = new Razorpay({
  key_id: "rzp_test_rv1bH6Okprpr7t",
  key_secret: "UQLubEmmVQVepHrqrET6GTDZ",
});

// ✅ Create Razorpay Order
app.post("/api/create-order", isAuthenticated, async (req, res) => {
  const { amount } = req.body;
  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    });
    res.status(200).json(order);
  } catch (err) {
    console.error("Order creation error:", err);
    res.status(500).json({ message: "Failed to create order" });
  }
});

// ✅ Verify Razorpay Payment
app.post("/api/verify-payment", isAuthenticated, async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const generatedSignature = crypto
    .createHmac("sha256", "UQLubEmmVQVepHrqrET6GTDZ")
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generatedSignature === razorpay_signature) {
    res.status(200).json({ message: "Payment verified" });
  } else {
    res.status(400).json({ message: "Invalid payment signature" });
  }
});

// ✅ Create Booking after Payment with amount
app.post("/api/bookings", isAuthenticated, async (req, res) => {
  try {
    const { carId, fromDate, toDate, location, paymentId } = req.body;

    if (!carId || !fromDate || !toDate || !location) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Fetch car details to get daily price
    const car = await Vehicle.findById(carId);
    if (!car || typeof car.pricePerDay !== 'number') {
      return res.status(404).json({ message: "Car not found or price is invalid." });
    }

    // Calculate rental duration in days
    const from = new Date(fromDate);
    const to = new Date(toDate);
    if (isNaN(from.getTime()) || isNaN(to.getTime())) {
      return res.status(400).json({ message: "Invalid date format." });
    }

    const durationInMs = to - from;
    const rentalDays = Math.ceil(durationInMs / (1000 * 60 * 60 * 24));

    if (rentalDays <= 0) {
      return res.status(400).json({ message: "Rental duration must be at least 1 day." });
    }

    const totalAmount = rentalDays * car.pricePerDay;

    if (isNaN(totalAmount) || totalAmount <= 0) {
      console.error("💥 Invalid total amount:", totalAmount);
      return res.status(400).json({ message: "Failed to calculate booking amount." });
    }


    const newBooking = new Booking({
      userId: req.session.userId,
      carId,
      fromDate,
      toDate,
      location,
      paymentId,
      amount: totalAmount,
    });

    await newBooking.save();
    res.status(201).json({ message: "Booking submitted successfully!", booking: newBooking });
  } catch (error) {
    console.error("Error submitting booking:", error);
    res.status(500).json({ message: "Error submitting booking", error: error.message });
  }
});




// ✅ API: Get all bookings for the logged-in user
app.get("/api/mybookings", isAuthenticated, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.session.userId })
      .populate("carId", "brand modelYear images")
      .select("fromDate toDate location status paymentId amount carId"); // ✅ explicitly include fields

    res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Database fetch error" });
  }
});


// ✅ API: Get all bookings (Admin View)
app.get("/api/admin/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "fullName email")
      .populate("carId", "brand modelYear");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

// ✅ API: Admin approves or rejects a booking
app.patch("/api/admin/bookings/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json({ message: `Booking updated successfully`, updatedBooking });
  } catch (err) {
    console.error("Error updating booking status:", err);
    res.status(500).json({ error: "Failed to update booking status" });
  }
});


// ✅ API: Delete a booking (User can delete their own)
app.delete("/api/mybookings/:id", isAuthenticated, async (req, res) => {
  try {
    const booking = await Booking.findOneAndDelete({ _id: req.params.id, userId: req.session.userId });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json({ message: "Booking deleted successfully" });
  } catch (err) {
    console.error("Error deleting booking:", err);
    res.status(500).json({ error: "Failed to delete booking" });
  }
});

// ✅ API: Get only approved bookings
app.get("/api/bookings/approved", async (req, res) => {
  try {
    const bookings = await Booking.find({ status: "Approved" }).populate("carId", "brand modelYear");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch approved bookings" });
  }
});

// *******************************************************************





// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
