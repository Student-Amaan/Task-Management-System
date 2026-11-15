const mongoose = require ("mongoose")

const taskSchema = new mongoose.Schema({
  title : {
    type : String,
    required : [true,"Task title is required"],
    trim: true,
    minlength : [3,'title must be at least 3 character'],
    maxlength : [100 , "title can't axceed 100 character"],
  },
  description : {
    type : String,
    required : true
  },
  status : {
    type : String,
    enum : ['pending' , "complete" , "Reject"],
    default : "pending"
  },
  priority : {
    type : String,
    enum : ["low","medium " , "high"],
    default : "medium",
    required : true
  },

  Date : {
    type : Date,
    default : Date.now()
  }
})

const task = mongoose.model("Task", taskSchema)

module.exports = task