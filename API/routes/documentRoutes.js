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
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file limit
});

// Routes
router.post(
  "/documents",
  authMiddleware(["user", "admin"]), // Check user authentication/authorization
  upload.single("document"), // Use 'document' as the field name for file upload
  postDocument // Handle the file upload logic
);

module.exports = router;

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
  "/documents/:fileName/download",
  authMiddleware(["admin", "user"]),
  downloadDocument
);

router.get(
  "/countSharedDocuments",
  authMiddleware(["admin"]),
  countSharedDocuments
);

module.exports = router;
