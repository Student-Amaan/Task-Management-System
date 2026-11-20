const express = require("express");

const {
  registerUser,
  loginUser,
  getProfile,
} = require("../controllers/user.Controller");

const { protectJwt } = require("../middleware/auth.Middlewares");



const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protectJwt, getProfile);

module.exports = router;
