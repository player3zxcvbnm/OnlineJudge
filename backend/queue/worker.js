const { Worker } = require('bullmq')
const mongoose = require('mongoose')
const Submission = require('../models/Submission')
require('dotenv').config()

const connection = {
  host: '127.0.0.1',
  port: 6379
}

mongoose.connect(process.env.MONGO_URI, { family: 4 })

const worker = new Worker('submissions', async (job) => {
  const { submissionId } = job.data
  console.log(`Processing submission: ${submissionId}`)

  // For now just update verdict to AC (we'll add Docker execution later)
  await Submission.findByIdAndUpdate(submissionId, { verdict: 'AC' })
  console.log(`Submission ${submissionId} processed`)

}, { connection })

worker.on('completed', (job) => console.log(`Job ${job.id} completed`))
worker.on('failed', (job, err) => console.log(`Job ${job.id} failed:`, err))