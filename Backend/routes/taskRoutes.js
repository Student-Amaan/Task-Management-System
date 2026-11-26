const express = require("express");

const {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTaskId,
} = require("../controllers/taskController");
const { protectJwt } = require("../middleware/auth.Middlewares");
const {
  createTaskValidator,
  updateTaskValidator,
} = require("../validators/task.Validator");
const validateRequest = require("../middleware/validateRequest");


const router = express.Router();

router.post(
  "/task",
  protectJwt,
  createTaskValidator,
  validateRequest,
  createTask,
);
router.get("/", protectJwt, getAllTasks);
router.get("/:id", getTaskById);
router.put(
  "/:id",
  protectJwt,
  updateTaskValidator,
  validateRequest,
  updateTask,
);
router.delete("/:id", protectJwt, deleteTaskId);

module.exports = router;
