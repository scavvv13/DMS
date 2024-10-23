const express = require("express");
const {
  getAttendanceRecords,
  logLogout,
} = require("../controllers/AttendanceController");
const authMiddleware = require("../middlewares/AuthMiddleware");

const router = express.Router();

// Route to get attendance records for the authenticated user
router.get(
  "/attendance",
  authMiddleware(["user", "admin"]), // Middleware to ensure only users or admins access this route
  getAttendanceRecords
);

// Route to log user logout (update attendance with logout time)
router.patch(
  "/logLogout", // No need for `:userId` as it can be derived from the authenticated user
  authMiddleware(["user", "admin"]), // Middleware to verify authentication
  logLogout
);

module.exports = router;
