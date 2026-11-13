const { default: mongoose } = require("mongoose");

const connectDB = async() => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB Connected Successfully!")
  } catch (error) {
    console.log("Error connecting db", error)
  }
}

module.exports = connectDB;