const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
  completed: {
    default: false,
    type: Boolean
  },
  description: {
    required: true,
    trim: true,
    type: String
  },
  owner: {
    ref: 'User',
    required: true,
    type: mongoose.Schema.Types.ObjectId
  },
  title: {
    required: true,
    trim: true,
    type: String
  }
}, {
  timestamps: true
})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task