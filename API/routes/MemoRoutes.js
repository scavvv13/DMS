const express = require("express");
const authMiddleware = require("../middlewares/AuthMiddleware");
const {
  getMemos,
  deleteMemo,
  postMemo,
  updateMemo,
} = require("../controllers/MemoControllers");
const router = express.Router();

// Routes
router.post("/memos", authMiddleware(["admin"]), postMemo); // Upload memo

router.get("/memos", authMiddleware(["user", "admin"]), getMemos); // Get all documents

router.delete("/memo/:id", authMiddleware(["admin"]), deleteMemo); // Delete memo by ID
router.put("/memo/:id", authMiddleware(["admin"]), updateMemo); // Add this line for updating memos

module.exports = router;
