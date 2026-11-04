require('dotenv').config()

const express = require("express");

const connectDB = require("./db/connectdb");

const app = express();

const port = 5000;

app.use(express.json);
 connectDB()

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`Api is running on port : ${port}`);
});


