const mongoose = require('mongoose')

const submissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'AuthUser', required: true },
  problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
  code: { type: String, required: true },
  language: { type: String, enum: ['cpp', 'python', 'java', 'javascript'], required: true },
  verdict: { type: String, enum: ['AC', 'WA', 'TLE', 'MLE', 'RE', 'CE', 'PENDING'], default: 'PENDING' },
  executionTime: { type: Number },
  memoryUsed: { type: Number }
}, { timestamps: true })

module.exports = mongoose.model('Submission', submissionSchema)