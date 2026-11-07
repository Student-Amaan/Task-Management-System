const Task = require("../models/TaskModels");

const createTask = async (req, res) => {
  try {
    const { title, description, priority } = req.body;
    const task = await Task.create({
      title: title,
      description: description,
      priority: priority,
    });

    if (!task) {
      return res
        .status(400)
        .json({ message: "please enter a valid information" });
    }

    res.status(201).json({
      message: "task created sucessfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: "Create Internal server error",
      error: error.message,
    });
  }
};

module.exports = { createTask };
