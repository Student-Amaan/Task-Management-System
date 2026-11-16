const express = require("express")
const {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTaskId,
} = require("../controllers/taskController");

const router = express.Router()

router.post("/task", createTask)
router.get("/" , getAllTasks)
router.get("/:id", getTaskById)
router.put("/:id", updateTask);
router.delete("/:id" , deleteTaskId)

module.exports = router