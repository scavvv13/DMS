const express = require("express");
const { register, login } = require("../controllers/AuthController");
const loginLimiter = require("../utils/RateLimiter");

const router = express.Router();

router.post("/register", register);
router.post("/login", loginLimiter, login);

module.exports = router;
