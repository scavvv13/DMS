const express = require("express");
const { register, login } = require("../controllers/AuthController");
const loginLimiter = require("../utils/RateLimiter");
const multer = require("multer");
const upload = multer();

const router = express.Router();

router.post("/register", upload.single("profilePicture"), register);
router.post("/login", loginLimiter, login);

module.exports = router;
