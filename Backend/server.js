require("dotenv").config();

const express = require("express");

const TaskRoute = require("./routes/taskRoutes");
const connectDB = require("./config/db");
const errorMiddleware = require("./middleware/errorMiddlewares");
const userRoute = require("./routes/user.Routes");
const redisClient = require("./config/redis");

const app = express();
const port = 5000;

// Middleware
app.use(express.json());

// Routes
app.use("/api/tasks", TaskRoute);
app.use("/api/users", userRoute);

// Root Route
app.get("/", (req, res) => {
  console.log("Root Route Hit");
  res.send("Server is running");
});

// Error Middleware
app.use(errorMiddleware);

// Start Server
const startServer = async () => {
  try {
    // Connect MongoDB
    await connectDB();
    console.log("MongoDB Connected Successfully");

    // Connect Redis
    await redisClient.connect();
    console.log("Redis Connected Successfully");

    // Start Express Server
    app.listen(port, () => {
      console.log(`API is running on port: ${port}`);
    });
  } catch (error) {
    console.error("Server Startup Error:", error);
    process.exit(1);
  }
};

startServer();
