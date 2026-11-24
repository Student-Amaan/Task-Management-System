const Task = require("../models/TaskModels");
const AppError = require("../utils/AppError");
const asyncHandler = require("express-async-handler");


const createTask = asyncHandler(async (req, res) => {
  const { title, description, priority, status, dueDate } = req.body;

  if (!title) {
    throw new AppError("Title is required", 400);
  }

  const task = await Task.create({
    title,
    description,
    priority,
    status,
    dueDate,
    user: req.user._id,
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

  // Always filter by logged-in user
  let filter = {
    user: req.user._id,
  };

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
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 5));

  const skip = (page - 1) * limit;

  // 4. Get Tasks
  const tasks = await Task.find(filter).sort(sortAt).skip(skip).limit(limit);

  // 5. Count Total Tasks
  const totalTasks = await Task.countDocuments(filter);

  // 6. Response
  res.status(200).json({
    success: true,
    message: "Tasks fetched successfully",
    count: tasks.length,
    currentPage: page,
    totalPages: Math.ceil(totalTasks / limit),
    totalTasks,
    tasks,
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
  const { title, description, status, priority, dueDate } = req.body;

  const updateTaskId = await Task.findOneAndUpdate(
    {
      _id: req.params.id,
      user: req.user._id,
    },
    {
      title,
      description,
      status,
      priority,
      dueDate,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updateTaskId) {
    throw new AppError("Task not found or you are not authorized", 404);
  }

  res.status(200).json({
    success: true,
    message: "Task updated successfully",
    task: updateTaskId,
  });
});




const deleteTaskId = asyncHandler(async (req, res) => {
  const deleteTask = await Task.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!deleteTask) {
    throw new AppError("Task not found or you are not authorized", 404);
  }

  res.status(200).json({
    success: true,
    message: "Task successfully deleted",
    task: deleteTask,
  });
});




module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTaskId,
};
