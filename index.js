const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");
const tagRoutes = require("./routes/tags");
const userPostUserRoutes = require('./routes/user')
const SearchRouter = require('./routes/search')
const catagoryRoutes = require("./routes/catagory");
const User = require("./models/User");
const bcrypt = require("bcrypt");

dotenv.config();
const app = express();
connectDB();

// Allow specific origins for CORS
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://bibloadminnew.vercel.app',
  "https://udhmee-opt1.vercel.app"
];

// Set CORS before routes
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Needed to allow cookies to be sent
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// If behind a proxy (like Vercel or Railway), trust it
app.set('trust proxy', 1);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/catagory", catagoryRoutes);
app.use("/api/tag", tagRoutes);
app.use("/api/user", userPostUserRoutes);
app.use("/api/posts", postRoutes);
app.use("/api", SearchRouter);
app.use("/uploads", express.static('uploads'));

// Superadmin creation
const superAdminCreation = async () => {
  const existUser = await User.findOne({ email: "vivekbunker65@gmail.com" });
  if (!existUser) {
    const hashed = await bcrypt.hash("Vivek@1234", 10);
    await User.create({
      username: "Vivek@1234",
      email: "vivekbunker65@gmail.com",
      passward: hashed,
      role: "superadmin",
      isVerified: true,
      fromGoogle:false
    });
    console.log("✅ Super admin created");
  } else {
    console.log("⚠️ Super admin already exists");
  }
};

superAdminCreation();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
