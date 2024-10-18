const User = require("../models/UserModel");

// Get User Profile Controller
const getUserProfile = async (req, res) => {
  try {
    // Ensure user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    // Find user by ID and exclude password
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return user profile data
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Users Controller
const getUsers = async (req, res) => {
  try {
    // Ensure user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    // Fetch all users and exclude passwords
    const users = await User.find().select("-password"); // Fetch all users

    // Check if users were found
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    // Send users data as response
    res.status(200).json({
      success: true,
      users: users.map((user) => ({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete User Controller
const deleteUser = async (req, res) => {
  try {
    // Ensure user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    const { email } = req.params; // Get email from request parameters

    // Find user by email and delete
    const deletedUser = await User.findOneAndDelete({ email });

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Successfully deleted user
    res
      .status(200)
      .json({ success: true, message: "User deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Batch Delete Users Controller
const batchDeleteUsers = async (req, res) => {
  try {
    // Ensure user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    const { emails } = req.body; // Get emails from request body

    // Delete users by email
    const result = await User.deleteMany({ email: { $in: emails } });

    // Check if users were deleted
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No users found to delete." });
    }

    // Successfully deleted users
    res
      .status(200)
      .json({ success: true, message: "Selected users deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Make Admin Controller
const makeAdmin = async (req, res) => {
  try {
    // Ensure user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    const { email } = req.params; // Get email from request parameters

    // Find user and update their role to admin
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { role: "admin" },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    // Successfully updated user role
    res
      .status(200)
      .json({ success: true, message: "User made admin successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};

// Revoke Admin Controller
const revokeAdmin = async (req, res) => {
  try {
    // Ensure user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    const { email } = req.params; // Get email from request parameters

    // Find user and update their role to regular user
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { role: "user" },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    // Successfully updated user role
    res.status(200).json({
      success: true,
      message: "User admin role revoked successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = {
  getUserProfile,
  getUsers,
  deleteUser,
  batchDeleteUsers,
  makeAdmin,
  revokeAdmin,
};
