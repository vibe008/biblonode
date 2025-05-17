const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "vivekbunker65@gmail.com",
    pass: "ojoufavsgxwmxwag",
  },
});

module.exports = transporter;

