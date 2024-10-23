const express = require("express");
const { getNotifications } = require("../utils/NotificationUtil");
const authMiddleware = require("../middlewares/AuthMiddleware");

const router = express.Router();

router.get(
  "/notifications",
  authMiddleware(["user", "admin"]),
  getNotifications
);

module.exports = router;
