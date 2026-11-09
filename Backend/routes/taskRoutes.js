const express = require("express")
const { createTask , getAlltasks , getTaskById} = require("../controllers/taskController")

const router = express.Router()

router.post("/task", createTask)
router.get("/" , getAlltasks)
router.get("/:id", getTaskById)

module.exports = router