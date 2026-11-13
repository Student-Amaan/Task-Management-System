const Task = require("../models/TaskModels");

const createTask = async (req, res) => {
  try {
    const { title, description, priority, status } = req.body;
    const task = await Task.create({
      title: title,
      description: description,
      status: status,
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

const getAlltasks = async (req, res) => {
  try {
    const { status, sort } = req.query;
    let filter = {};
    if (status) {
      filter.status = status;
    }

    let sortAt = {};

    if (sort === "oldest") {
      sortAt.createdAt = 1;
    } else {
      sortAt.createdAt = -1;
    }

    // pegination

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const skip = (page - 1) * limit;

    const getTask = await Task.find(filter)
      .sort(sortAt)
      .skip(skip)
      .limit(limit);

      const totalTasks = await Task.countDocuments(filter)

    res.status(200).json({
      sucess: true,
      message: "task fetch successfully",
      count: getTask.length,
      currentPage: page,
      totalPages: Math.ceil(totalTasks / limit),
      tasks: getTask,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};

const getTaskById = async (req, res) => {
  try {
    const getTaskId = await Task.findById(req.params.id);
    if (!getTaskId) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "User found sucessfully",
      task: getTaskId,
    });
  } catch (error) {
    res.status(500).json({
      message: "get task by id is fail",
      error: error.message,
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const updateTaskId = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updateTaskId) {
      res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }
    res.status(200).json({
      message: "task updated sucessfully",
      task: updateTaskId,
    });
  } catch (error) {
    res.status(500).json({
      message: "task not updated",
      error: error.message,
    });
  }
};

const deleteTaskId = async (req, res) => {
  try {
    const deleteTask = await Task.findByIdAndDelete(req.params.id);
    if (!deleteTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Task successfully deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: "Task not deleted there is some error",
      error: error.message,
    });
  }
};

module.exports = {
  createTask,
  getAlltasks,
  getTaskById,
  updateTask,
  deleteTaskId,
};
