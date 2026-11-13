require("dotenv").config();

console.log("MY TASK SERVER FILE IS RUNNING");

const express = require("express");

const TaskRoute = require("./routes/taskRoutes");
const connectDB = require("./config/db");


const app = express();



const port = 5000;

connectDB();
app.use(express.json());

app.use("/api/tasks", TaskRoute);


app.get("/", (req, res) => {
  console.log("Root Route Hit")
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`Api is running on port : ${port}`);
});
