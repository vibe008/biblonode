const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const transporter = require("../config/nodemailer");
const salt = bcrypt.genSaltSync(10);
const crypto = require('crypto');
exports.register = async (req, res) => {
  try {
    console.log("req.body", req.body)
    const { username, email, passward } = req.body;
    const hasedPassward = await bcrypt.hash(passward, salt);
    if (!email || email.trim() === "") {
      return res.status(400).json({ message: "Email is required" })
    }
    const exiexistUser = await User.findOne({ email: email });
    if (exiexistUser) {
      return res.status(409).json({ message: "User already exists" });
    }
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const user = await User.create({
      username,
      email,
      passward: hasedPassward,
      verificationToken,
      role: "user"
    });
    const verificationLink = `http://localhost:5000/api/auth/verify/${verificationToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify your email",
      html: `<p>Hello ${username}, click the link to verify: <a href="${verificationLink}">${verificationLink}</a></p>`,
    });

    return res.status(201).json({ message: "User registered. Please verify your email.", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.regiserAdmin = async (req, res) => {
  try {
    const { username, email, passward } = req.body
    const exiexistUser = User.findOne({ email: email })
    if (!exiexistUser) return await res.status(409).json({ message: "User already exists" })

    const hasedPassward = await bcrypt.hash(passward, salt);
    if (!email || email.trim() === "") {
      return res.status(400).json({ message: "Email is required" })
    }

    const admin = await User.create({
      username,
      email,
      passward: hasedPassward,
      role: "admin",
      isVerified: true
    });
    res.status(201).json({ message: "Admin registered successfully", admin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}



exports.login = async (req, res) => {
  try {
    const { email, passward } = req.body;
    console.log("req.bodylogin", req.body)
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(passward, user.passward))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify your email before logging in." });
    }
    if (user) {
      user.lastLogin = new Date();
      user.isLoggedIn = true;
      await user.save(); // ✅ Save the changes to the database
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
    res.cookie("token", token, { httpOnly: true });
    res.json({ message: "Login successful", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const token = await req.cookies.token
    if (!token) return res.status(400).json({ message: "no Token Provided" })

    const decode = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decode.id);
    if (user) {
      user.isLoggedIn = false;
      user.lastLogout = new Date();
      await user.save();
    }
    res.clearCookie("token");
    res.json({ message: "Logged out" });
  } catch (error) {
    res.status(500).json({ error: err.message });
  }

};


exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ verificationToken: token });

    if (!user) return res.status(400).json({ message: "Invalid token" });

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();
    // return res.redirect("http://localhost:3000/signin");
    return res.redirect("http://localhost:3000/signin?verified=true");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};