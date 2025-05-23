const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const allowedOrigins = [
  "http://localhost:3000", // for local development
  "https://portfolio-frontend-sage-chi.vercel.app/", // your deployed frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
  })
);
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: "gmail", // or any other email service you want to use
  auth: {
    user: process.env.EMAIL, // Your email address (e.g., yourname@gmail.com)
    pass: process.env.EMAIL_PASSWORD, // Your email password or app-specific password
  },
});

app.post("/api/contact", (req, res) => {
  const { name, email, subject, message } = req.body;

  const mailOptions = {
    from: email,
    to: process.env.RECEIVER_EMAIL, // Your email address to receive messages
    subject: subject,
    text: `\n\n${message}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ message: "Something went wrong" });
    }
    res.status(200).json({ message: "Message sent successfully!" });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
