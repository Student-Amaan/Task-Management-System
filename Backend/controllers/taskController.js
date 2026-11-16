const Task = require("../models/TaskModels");
const AppError = require("../utils/AppError");
const asyncHandler = require("express-async-handler");

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
      throw new AppError("Please enter a valid information", 400);
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

const getAllTasks = asyncHandler(async (req, res) => {
  // 1. Search and Filtering
  const { status, sort } = req.query;

  let filter = {};

  if (status) {
    filter.status = status;
  }

  // 2. Sorting
  let sortAt = {};

  if (sort === "oldest") {
    sortAt.createdAt = 1;
  } else {
    sortAt.createdAt = -1;
  }

  // 3. Pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;

  const skip = (page - 1) * limit;

  // 4. Get Tasks
  const getTask = await Task.find(filter).sort(sortAt).skip(skip).limit(limit);

  // 5. Count Total Tasks
  const totalTasks = await Task.countDocuments(filter);

  // 6. Response
  res.status(200).json({
    success: true,
    message: "Tasks fetched successfully",
    count: getTask.length,
    currentPage: page,
    totalPages: Math.ceil(totalTasks / limit),
    totalTasks,
    tasks: getTask,
  });
});

const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Task found successfully",
    task,
  });
});

const updateTask = asyncHandler(async (req, res) => {
  const updateTaskId = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updateTaskId) {
    throw new AppError("task not updated", 404);
  }
  res.status(200).json({
    message: "task updated sucessfully",
    task: updateTaskId,
  });
});

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
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTaskId,
};
