const mongoose = require ("mongoose")

const connectDB = async () => {
   try {
     await mongoose.connect(process.env.MONGO_URI);
     console.log("Connection sucessfully...");
   } catch (error) {
   
     console.log("Connection Faild ", error.message);
   }
}
 


module.exports = connectDB