const { body } = require("express-validator");

const createTaskValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be 3 to 100 characters"),

  body("description").trim().notEmpty().withMessage("Description is required"),

  body("priority")
    .notEmpty()
    .withMessage("Priority is required")
    .isIn(["low", "medium", "high"])
    .withMessage("Invalid priority"),

  body("status")
    .optional()
    .isIn(["pending", "complete", "Reject"])
    .withMessage("Invalid status"),

  body("dueDate").optional().isISO8601().withMessage("Invalid due date"),
];


const updateTaskValidator = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be 3 to 100 characters"),

  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Description cannot be empty"),

  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Invalid priority"),

  body("status")
    .optional()
    .isIn(["pending", "complete", "Reject"])
    .withMessage("Invalid status"),

  body("dueDate").optional().isISO8601().withMessage("Invalid due date"),
];


module.exports = { createTaskValidator , updateTaskValidator };
