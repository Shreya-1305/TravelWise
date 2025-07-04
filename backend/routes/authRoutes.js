const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

// 🔐 Public routes

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

// 🔒 Protected route (only for logged-in users)
router.patch(
  "/updateMyPassword",
  authController.protect,
  authController.updatePassword
);

module.exports = router;
