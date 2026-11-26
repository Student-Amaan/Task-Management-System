require("dotenv").config();

const express = require("express");
const helmet = require("helmet")
const cors = require("cors")
const { rateLimit } = require("express-rate-limit");
const TaskRoute = require("./routes/taskRoutes");
const connectDB = require("./config/db");
const errorMiddleware = require("./middleware/errorMiddlewares");
const userRoute = require("./routes/user.Routes");
const redisClient = require("./config/redis");

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});
const port = 5000;

// Middleware

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT",  "DELETE"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(helmet())
app.use(express.urlencoded({ extended: true }));

app.use("/api", limiter)

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
