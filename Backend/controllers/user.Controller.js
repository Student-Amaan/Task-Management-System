const User = require("../models/user.Models");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const AppError = require("../utils/AppError");
const jwt = require("jsonwebtoken");

const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new AppError("Please fill all fields", 400);
  }

  const existingUser = await User.findOne({
    email: email.toLowerCase().trim(),
  });

  if (existingUser) {
    throw new AppError("User already exist", 400);
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: hashPassword,
  });

  res.status(201).json({
    success: true,
    message: "User created sucessfully",
    data: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    },
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError("Please provide the valid email or password", 400);
  }

  const user = await User.findOne({
    email: email.toLowerCase().trim(),
  });

  if (!user) {
    throw new AppError("invalid email or password", 401);
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    throw new AppError(" invalid password", 401);
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECREAT, {
    expiresIn: 7,
  });

  res.status(200).json({
    success : true,
    message : "Login successfully",
    token,
    data : {
      id : user._id,
      name : user.name,
      email : user.email
    }
  })
});

module.exports = {
  registerUser,
  loginUser
};
