const express = require("express");

const router = express.Router();
const user = require("../models/userModel");

const userController = require("../controllers/userController");
const { generateToken, jwtAuthMiddleware } = require("../jwt.js");

router.post("/signup", userController.signup);
//login route
router.post("/login", userController.login);

router.get("/profile", jwtAuthMiddleware, userController.getUserProfile);

router.put(
  "/profile/password",
  jwtAuthMiddleware,
  userController.updatePassword,
);

module.exports = router;
