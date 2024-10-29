const express = require("express");
const authMiddleware = require("../middlewares/AuthMiddleware");
const multer = require("multer");
const {
  postDocument,
  getDocuments,
  deleteDocument,
  shareDocument,
  countDocuments,
  countSharedDocuments,
  downloadDocument,
  removeAccess, // Import the deleteDocument controller
} = require("../controllers/documentController");
const router = express.Router();

// Multer setup for file uploads
const upload = multer({
  storage: multer.memoryStorage(), // Store files in memory before uploading to Firebase
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
});

// Routes
router.post(
  "/documents",
  authMiddleware(["user", "admin"]),
  upload.single("document"),
  postDocument
); // Upload document

router.get("/documents", authMiddleware(["user", "admin"]), getDocuments); // Get all documents

router.delete(
  "/documents/:id",
  authMiddleware(["user", "admin"]),
  deleteDocument
); // Delete document by ID

router.post(
  "/documents/:id/share",
  authMiddleware(["user", "admin"]),
  shareDocument
); // Share document with users

router.post(
  "/documents/:id/remove-access",
  authMiddleware(["user", "admin"]),
  removeAccess
);

router.get("/countDocuments", authMiddleware(["admin"]), countDocuments);

router.get(
  "/documents/:id/download",
  authMiddleware(["admin", "user"]),
  downloadDocument
);

router.get(
  "/countSharedDocuments",
  authMiddleware(["admin"]),
  countSharedDocuments
);

module.exports = router;
