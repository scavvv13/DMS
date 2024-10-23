const Attendance = require("../models/AttendanceModel");

// Function to log user attendance on login
exports.logAttendance = async (userId) => {
  try {
    const attendance = new Attendance({
      userId,
      // `logoutTime` defaults to null, and login is implied
    });
    await attendance.save();
    console.log(`Login recorded for user: ${userId}`);
  } catch (error) {
    console.error("Failed to log attendance:", error);
  }
};

// Function to log user logout (updated for PATCH request)
exports.logLogout = async (req, res) => {
  const userId = req.body.userId; // Get userId from the request body
  try {
    // Find the most recent attendance record where logoutTime is null (still logged in)
    const recentAttendance = await Attendance.findOne({
      userId,
      logoutTime: null, // Find active session
    }).sort({ loginTime: -1 });

    if (recentAttendance) {
      recentAttendance.logoutTime = new Date(); // Set the logout time to current date
      await recentAttendance.save();
      console.log(`Logout recorded for user: ${userId}`);
      res.status(200).json({ message: "Logout recorded successfully" });
    } else {
      console.log(`No active login session found for user: ${userId}`);
      res.status(404).json({ message: "No active session found to log out" });
    }
  } catch (error) {
    console.error("Failed to log logout:", error);
    res.status(500).json({ message: "Failed to log logout" });
  }
};

// Function to get the attendance records for a specific user
exports.getAttendanceRecords = async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from authenticated user
    const attendanceRecords = await Attendance.find({ userId }).sort({
      loginTime: -1, // Sort by latest login time
    });
    res.status(200).json(attendanceRecords); // Send sorted attendance records as JSON response
  } catch (error) {
    console.error("Failed to fetch attendance records:", error);
    res.status(500).json({ message: "Failed to fetch attendance records" });
  }
};
