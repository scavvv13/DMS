const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const bucket = require("../config/firebase");
const { logAttendance } = require("./AttendanceController");

// Registration Controller
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const file = req.file; // Assuming you're using multer to handle the profile picture upload

    // Validate required fields
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    // Validate password length
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    let profilePictureUrl = ""; // Placeholder for profile image URL

    // If a file (profile picture) is uploaded
    if (file) {
      // Upload profile picture to Firebase Cloud Storage
      const blob = bucket.file(`${uuidv4()}-${file.originalname}`);
      const blobStream = blob.createWriteStream({
        resumable: false,
      });

      blobStream.on("error", (err) => {
        return res
          .status(500)
          .json({ message: "Profile picture upload failed", error: err });
      });

      // Upload completion handler
      const uploadPromise = new Promise((resolve, reject) => {
        blobStream.on("finish", async () => {
          try {
            const signedUrlArray = await blob.getSignedUrl({
              action: "read", // Make it publicly accessible
              expires: "03-01-2500", // Long expiration date
            });
            profilePictureUrl = signedUrlArray[0]; // Get the URL
            resolve(); // Resolve the promise when done
          } catch (err) {
            reject(err); // Handle error in signed URL generation
          }
        });
      });

      blobStream.end(file.buffer); // End stream and upload the image
      await uploadPromise; // Wait for the upload and URL generation to complete
    }

    // Create new user with profile picture URL
    const user = new User({
      name,
      email,
      password,
      role,
      profilePictureUrl, // Save the uploaded profile image URL in MongoDB
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );

    // Return the token and user role
    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        profilePictureUrl, // Include profile image URL in the response
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login Controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide both email and password" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );

    // Log the user's attendance (login event)
    await logAttendance(user._id); // No need to pass "login" action as it's default

    // Return the token and user role
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { register, login };
