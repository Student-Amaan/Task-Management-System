const express = require("express")
const {
  createTask,
  getAlltasks,
  getTaskById,
  updateTask,
  deleteTaskId,
} = require("../controllers/taskController");

const router = express.Router()

router.post("/task", createTask)
router.get("/" , getAlltasks)
router.get("/:id", getTaskById)
router.put("/:id", updateTask);
router.delete("/:id" , deleteTaskId)

module.exports = router