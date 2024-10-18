const express = require("express");
const {
  getUserProfile,
  getUsers,
  deleteUser,
  batchDeleteUsers,
  makeAdmin,
  revokeAdmin,
} = require("../controllers/UserController");
const authMiddleware = require("../middlewares/AuthMiddleware");

const router = express.Router();

router.get("/profile", authMiddleware(["user", "admin"]), getUserProfile);
router.get("/users", authMiddleware(["admin"]), getUsers);
router.delete("/users/:email", authMiddleware(["admin"]), deleteUser); // Single user delete
router.post("/users/batch-delete", authMiddleware(["admin"]), batchDeleteUsers); // Batch delete users
router.patch("/users/make-admin/:email", authMiddleware(["admin"]), makeAdmin); // Make admin
router.patch(
  "/users/revoke-admin/:email",
  authMiddleware(["admin"]),
  revokeAdmin
); // Revoke admin

module.exports = router;
