const asyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")
const AppError = require("../utils/AppError")


const protectJwt = asyncHandler(async(req,res,next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new AppError("Not authorized token messing", 401);
  }

  const token = authHeader.split(" ")[1]

  const decode = jwt.verify(token, process.env.JWT_SECREAT);
  console.log(decode)
  req.user = decode

  next()

})

module.exports = { protectJwt}
