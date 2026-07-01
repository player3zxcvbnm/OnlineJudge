const { Worker } = require('bullmq')
const mongoose = require('mongoose')
const axios = require('axios')
const IORedis = require('ioredis')
const Submission = require('../models/Submission')
const TestCase = require('../models/TestCase')
require('dotenv').config()

const connection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null
})

mongoose.connect(process.env.MONGO_URI, { family: 4 })

const LANGUAGE_MAP = {
  cpp: { language: 'cpp', version: '10.2.0' },
  python: { language: 'python', version: '3.10.0' },
  java: { language: 'java', version: '15.0.2' },
  javascript: { language: 'javascript', version: '18.15.0' }
}

const runCode = async (code, language, input) => {
  try {
    const langConfig = LANGUAGE_MAP[language]
    if (!langConfig) {
      return { output: '', error: 'Unsupported language' }
    }

    const filename = {
      cpp: 'solution.cpp',
      python: 'solution.py',
      java: 'Main.java',
      javascript: 'solution.js'
    }[language]

    const res = await axios.post('https://emkc.org/api/v2/piston/execute', {
      language: langConfig.language,
      version: langConfig.version,
      files: [{ name: filename, content: code }],
      stdin: input
    }, { timeout: 15000 })

    const result = res.data.run

    if (result.signal === 'SIGKILL' || result.code === 124) {
      return { output: '', error: 'TLE' }
    }
    if (result.stderr && result.stderr.trim()) {
      return { output: '', error: result.stderr }
    }
    return { output: result.stdout.trim(), error: null }
  } catch (err) {
    return { output: '', error: 'RE' }
  }
}

const worker = new Worker('submissions', async (job) => {
  const { submissionId } = job.data
  console.log(`Processing submission: ${submissionId}`)
  const submission = await Submission.findById(submissionId)
  const testCases = await TestCase.find({ problemId: submission.problemId })
  if (testCases.length === 0) {
    await Submission.findByIdAndUpdate(submissionId, { verdict: 'AC' })
    return
  }
  let verdict = 'AC'
  for (const tc of testCases) {
    const result = await runCode(submission.code, submission.language, tc.input)
    if (result.error === 'TLE') { verdict = 'TLE'; break }
    if (result.error) { verdict = 'RE'; break }
    if (result.output !== tc.expectedOutput.trim()) { verdict = 'WA'; break }
  }
  await Submission.findByIdAndUpdate(submissionId, { verdict })
  console.log(`Submission ${submissionId} verdict: ${verdict}`)
}, { connection })

worker.on('completed', (job) => console.log(`Job ${job.id} completed`))
worker.on('failed', (job, err) => console.log(`Job ${job.id} failed:`, err))