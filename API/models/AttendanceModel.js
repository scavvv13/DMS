// models/AttendanceModel.js

const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  loginTime: {
    type: Date,
    default: Date.now, // Automatically set the login time to the current date
  },
  logoutTime: {
    type: Date,
    default: null, // Set the default to null, allowing logoutTime to be either null or a Date
  },
});

module.exports = mongoose.model("Attendance", AttendanceSchema);
