const Attendance = require("../models/AttendanceModel");
const UserModel = require("../models/UserModel");

// Function to log user attendance on login
exports.logAttendance = async (userId) => {
  try {
    const attendance = new Attendance({
      userId,
      // logoutTime defaults to null, and login is implied
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
  const { date } = req.query; // Get the date from query parameters

  // Validate the date parameter
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    return res.status(400).json({ message: "Invalid date provided" });
  }

  try {
    // Fetch all users
    const users = await UserModel.find();

    // Initialize an array to hold attendance records with user details
    const allRecords = await Promise.all(
      users.map(async (user) => {
        // Fetch attendance records for the specified date
        const attendanceRecords = await Attendance.find({
          userId: user._id,
          loginTime: {
            $gte: parsedDate.setHours(0, 0, 0, 0), // Start of the day
            $lt: parsedDate.setHours(23, 59, 59, 999), // End of the day
          },
        });

        if (attendanceRecords.length > 0) {
          // Get the earliest login time and latest logout time
          const earliestLogin = attendanceRecords.reduce((earliest, record) => {
            return new Date(record.loginTime) < new Date(earliest.loginTime)
              ? record
              : earliest;
          });

          const latestLogout = attendanceRecords.reduce(
            (latest, record) => {
              return record.logoutTime &&
                (new Date(record.logoutTime) > new Date(latest.logoutTime) ||
                  latest.logoutTime === null)
                ? record
                : latest;
            },
            { logoutTime: null }
          );

          const loginTime = new Date(earliestLogin.loginTime);
          const logoutTime = latestLogout.logoutTime
            ? new Date(latestLogout.logoutTime)
            : null;
          let status;

          // Determine the status based on login and logout times
          if (logoutTime) {
            const loginHour = loginTime.getHours();
            const logoutHour = logoutTime.getHours();

            // Check for lateness
            status = loginHour >= 8 ? "Late" : "On Time";

            // Check for overtime or undertime
            if (logoutHour < 17) {
              status = "Undertime"; // Clocked out early
            } else if (logoutHour >= 18) {
              status = "Overtime"; // Clocked out late
            }
          } else {
            status = "Not logged out yet"; // User still logged in
          }

          return {
            name: user.name,
            loginTime: loginTime.toISOString(),
            logoutTime: logoutTime ? logoutTime.toISOString() : null,
            status,
          };
        } else {
          return {
            name: user.name,
            loginTime: null,
            logoutTime: null,
            status: "Absent", // No attendance records for the day
          };
        }
      })
    );

    res.status(200).json(allRecords); // Send all attendance records as JSON response
  } catch (error) {
    console.error("Failed to fetch attendance records:", error);
    res.status(500).json({ message: "Failed to fetch attendance records" });
  }
};
