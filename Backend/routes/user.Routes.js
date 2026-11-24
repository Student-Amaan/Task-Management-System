const express = require("express");

const {
  registerUser,
  loginUser,
  getProfile,
} = require("../controllers/user.Controller");

const { protectJwt } = require("../middleware/auth.Middlewares");
const { authorize } = require("../middleware/role.Middlewares");
const { registerValidator, loginValidator } = require("../validators/user.Validator");
const validateRequest = require("../middleware/validateRequest");





const router = express.Router();

router.post("/register", registerValidator, validateRequest, registerUser);
router.post("/login", loginValidator ,validateRequest,  loginUser);
router.get("/profile", protectJwt, getProfile);

router.get("/admin", protectJwt , authorize('admin'), (req,res) => {
  res.status(200).json({
    success : true,
    message : "welcome to admain dashboard"
  })
} )

module.exports = router;
