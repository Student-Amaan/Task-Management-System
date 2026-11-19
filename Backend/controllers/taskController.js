const Task = require("../models/TaskModels");
const AppError = require("../utils/AppError");
const asyncHandler = require("express-async-handler");


const createTask = asyncHandler(async (req, res) => {
  const { title, description, priority, status } = req.body;

  if (!title) {
    throw new AppError("Title is required", 400);
  }

  const task = await Task.create({
    title,
    description,
    priority,
    status,
  });

  res.status(201).json({
    success: true,
    message: "Task created successfully",
    task,
  });
});


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


const deleteTaskId = asyncHandler(async (req, res) => {
  const deleteTask = await Task.findByIdAndDelete(req.params.id);

  if (!deleteTask) {
    throw new AppError("Task not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Task successfully deleted",
  });
});



module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTaskId,
};
