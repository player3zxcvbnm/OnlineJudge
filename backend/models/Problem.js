const mongoose = require('mongoose')

const problemSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  statement: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  timeLimit: { type: Number, required: true },
  memoryLimit: { type: Number, required: true },
  tags: [String]
}, { timestamps: true })

module.exports = mongoose.model('Problem', problemSchema)