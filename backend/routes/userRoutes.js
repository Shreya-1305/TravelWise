// userRoutes.js
const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

// 🔒 Protect all routes after this middleware
router.use(authController.protect);

// ✅ Add /me route
router.get("/me", userController.getMe, userController.getUser);

// 👤 Logged-in user routes
router.patch("/updateMe", userController.updateMe);
router.delete("/deleteMe", userController.deleteMe);

// 🛠️ Admin/debug route – get all users
router.get("/", userController.getAllUsers); // Optional, mostly for admin/debug

module.exports = router;
