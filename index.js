const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");
const tagRoutes = require("./routes/tags");
const catagoryRoutes = require("./routes/catagory");
const User = require("./models/User");
const bcrypt = require("bcrypt");
dotenv.config();
const app = express();
connectDB();

app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true
}));

const superAdminCreation = async () => {
    const exiexistUser = await User.findOne({ email: "vivekbunker65@gmail.com" })
    const hashed = await bcrypt.hash("Vivek@1234", 10);
    if (!exiexistUser) {
        User.create({
            username: "Vivek@1234",
            email: "vivekbunker65@gmail.com",
            passward: hashed,
            role: "superadmin",
            isVerified: true,
        })
        console.log("✅ Super admin created");
    }
    else {
        console.log("⚠️ Super admin already exists");
    }
}

superAdminCreation();


app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);
app.use('/api/catagory', catagoryRoutes);
app.use('/api/tag', tagRoutes);
app.use('/api/posts', postRoutes);
app.use('/uploads', express.static('uploads'));
// Routes
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
