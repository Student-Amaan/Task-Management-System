const AppError = require("../utils/AppError")


const authorize = (...roles) => {
  
  return (req , res , next) => {
    
    if (!roles.includes(req.user.role)) {
      return next(
         new AppError("You are not authorize to access this file", 403)
      );
    }
    next()
  }
}


module.exports = {authorize}