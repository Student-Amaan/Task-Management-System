const redisClient = require("../config/redis");
const Task = require("../models/TaskModels");
const AppError = require("../utils/AppError");
const asyncHandler = require("express-async-handler");

const clearUserTaskCache = async (userId) => {
  const pattern = `tasks:${userId}:*`;

  for await (const key of redisClient.scanIterator({
    MATCH: pattern,
    COUNT: 100,
  })) {
    await redisClient.del(key);
  }
};

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
  const { status, sort } = req.query;

  // 1. Pagination
  const page = Math.max(1, Number(req.query.page) || 1);

  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 5));

  // 2. Create user-specific cache key
  const userId = req.user._id.toString();

  const cacheKey = `tasks:${userId}:${JSON.stringify({
    status: status || "all",
    sort: sort || "newest",
    page,
    limit,
  })}`;

  // 3. Check Redis Cache
  const cachedTasks = await redisClient.get(cacheKey);

  console.log("Redis Ready:", redisClient.isReady);
  console.log("Generated Key:", cacheKey);
  console.log("Cached Data:", cachedTasks ? "FOUND" : "NOT FOUND");

  if (cachedTasks) {
    console.log("Redis Cache HIT");

    return res.status(200).json(JSON.parse(cachedTasks));
  }

  console.log("Redis Cache MISS");

  // 4. MongoDB Filtering
  const filter = {
    user: req.user._id,
  };

  if (status) {
    filter.status = status;
  }

  // 5. Sorting
  const sortAt = {};

  if (sort === "oldest") {
    sortAt.createdAt = 1;
  } else {
    sortAt.createdAt = -1;
  }

  // 6. Fetch Tasks from MongoDB
  const tasks = await Task.find(filter)
    .sort(sortAt)
    .skip((page - 1) * limit)
    .limit(limit);

  // 7. Count Total Tasks
  const totalTasks = await Task.countDocuments(filter);

  // 8. Prepare Response
  const responseData = {
    success: true,
    message: "Tasks fetched successfully",
    count: tasks.length,
    currentPage: page,
    totalPages: Math.ceil(totalTasks / limit),
    totalTasks,
    tasks,
  };

  // 9. Save Response in Redis for 60 seconds
 try {
   const result = await redisClient.setEx(
     cacheKey,
     300,
     JSON.stringify(responseData),
   );
   const verifyCache = await redisClient.get(cacheKey);

   console.log("Cache Verification:", verifyCache ? "SUCCESS" : "FAILED");

   console.log("Redis SET Result:", result);
   console.log("Cache Key:", cacheKey);
 } catch (error) {
   console.log("Redis SET Error:", error);
 }

  // 10. Send Response
  res.status(200).json(responseData);
});


const getTaskById = asyncHandler(async (req, res) => {
 const task = await Task.findOne({
   _id: req.params.id,
   user: req.user._id,
 });
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
