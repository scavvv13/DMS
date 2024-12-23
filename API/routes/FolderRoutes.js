const express = require("express");
const authMiddleware = require("../middlewares/AuthMiddleware");
const {
  createFolder,
  getFolders,
  renameFolder,
  deleteFolder,
  getFolderDetails,
} = require("../controllers/FolderController");

const router = express.Router();

// Routes
router.post("/folders", authMiddleware(["admin", "user"]), createFolder); // Create a folder
router.get("/folders", authMiddleware(["admin", "user"]), getFolders); // Get folders by parent
router.put("/folder/:folderId", authMiddleware(["admin", "user"]), renameFolder); // Rename a folder
router.delete("/folder/:folderId", authMiddleware(["admin", "user"]), deleteFolder); // Delete a folder
router.get("/folder/:folderId", authMiddleware(["admin", "user"]), getFolderDetails); // Get folder details

module.exports = router;
