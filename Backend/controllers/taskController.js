const Task = require("../models/TaskModels");

const createTask = async (req, res) => {
  try {
    const { title, description, priority , status } = req.body;
    const task = await Task.create({
      title: title,
      description: description,
      status : status,
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

const getAlltasks = async (req ,res) => {
  try {
    const getTask = await Task.find()
    res.status(200).json({
      sucess : true,
      message : "task fetch successfully",
      tasks : getTask
    })
  } catch (error) {
    res.status(500).json({
      success : false,
      message : "internal server error",
      error : error.message
    })
  }
}


const getTaskById = async (req ,res) => {
  try {
    const getTaskId = await Task.findById(req.params.id)
    if(!getTaskId){
      return res.status(404).json({
        success : false ,
        message : "user not found"
      })
    }
    res.status(200).json({
      success : true,
      message : "User found sucessfully",
      task : getTaskId
    })
  } catch (error) {
    res.status(500).json({
      message : "get task by id is fail",
      error : error.message
    })
  }
}

module.exports = { createTask , getAlltasks , getTaskById};
