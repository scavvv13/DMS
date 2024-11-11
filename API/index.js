const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const authRoutes = require("./routes/AuthRoutes");
const userRoutes = require("./routes/UserRoutes");
const documentRoutes = require("./routes/documentRoutes");
const memoRoutes = require("./routes/MemoRoutes");
const NotificationRoutes = require("./routes/NotificationRoutes");
const AttendanceRoutes = require("./routes/AttendanceRoutes");

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Change this to your frontend's URL
    methods: ["GET", "POST", "OPTIONS", "PATCH", "DELETE"], // Allow necessary methods
    credentials: true, // If you need to pass cookies or authorization headers
  })
);
app.use(helmet());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/", documentRoutes);
app.use("/api/", memoRoutes);
app.use("/api/", NotificationRoutes);
app.use("/api/", AttendanceRoutes);

// Database connection
mongoose
  .connect(`${process.env.MONGO_URI}/DMS`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Start server
const PORT = process.env.PORT || 3010;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
