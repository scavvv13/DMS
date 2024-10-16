const express = require("express");
const { getUserProfile } = require("../controllers/UserController");
const authMiddleware = require("../middlewares/AuthMiddleware");

const router = express.Router();

router.get("/profile", authMiddleware(["user", "admin"]), getUserProfile);

module.exports = router;
