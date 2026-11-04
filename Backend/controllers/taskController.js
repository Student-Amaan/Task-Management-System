const mongoose = require("mongoose");
const Task = require("../models/TaskModels");

const createTask = async (req, res) => {
  try {

    const task = new Task.create({
      
    })
  } catch (error) {
    res.status(500).json({
      message: "Create Internal server error",
      error,
    });
  }
};
