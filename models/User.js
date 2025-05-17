const mongooes = require("mongoose");

const userSchema = new mongooes.Schema(
  {
    username: { type: String, require: true, unique: true },
    email: { type: String, require: true, unique: true },
    passward: { type: String, require: true },
    isVerified: { type: Boolean, default: false },
    isLoggedIn: { type: Boolean, default: false },
    verificationToken: String,
    role: {
      type: String,
      enum: ['user', 'admin', 'superadmin'],
      default: 'user',
    },
    lastLogin: Date,
    lastLogout: Date
  },
  { timestamps: true }
);

module.exports = mongooes.model("User", userSchema);
