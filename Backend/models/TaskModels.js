const mongoose = require ("mongoose")

const taskSchema = new mongoose.Schema({
  title : {
    type : String,
    required : true
  },
  description : {
    type : String,
    required : true
  },
  status : {
    type : String,
    enum : ['pending' , "complete" , "Reject"],
    required : true
  },
  priority : {
    type : String,
    enum : ["low","medium " , "high"],
    required : true
  },

  Date : {
    type : Date,
    dueDate : Date.now()
  }
})

const task = mongoose.model("Task", taskSchema)

module.exports = task