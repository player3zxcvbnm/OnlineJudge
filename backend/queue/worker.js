const { Worker } = require('bullmq')
const mongoose = require('mongoose')
const { exec } = require('child_process')
const fs = require('fs')
const path = require('path')
const IORedis = require('ioredis')
const Submission = require('../models/Submission')
const TestCase = require('../models/TestCase')
require('dotenv').config()

const connection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null
})

mongoose.connect(process.env.MONGO_URI, { family: 4 })

const runCode = (code, language, input) => {
  return new Promise((resolve) => {
    const tmpDir = fs.mkdtempSync(path.join(require('os').tmpdir(), 'oj-'))
    let filename, image, compileCmd, runCmd
    if (language === 'cpp') {
      filename = path.join(tmpDir, 'solution.cpp')
      fs.writeFileSync(filename, code)
      image = 'gcc'
      compileCmd = `g++ -o /tmp/solution /code/solution.cpp`
      runCmd = `echo "${input.replace(/"/g, '\\"')}" | /tmp/solution`
    } else if (language === 'python') {
      filename = path.join(tmpDir, 'solution.py')
      fs.writeFileSync(filename, code)
      image = 'python:3.11-slim'
      runCmd = `echo "${input.replace(/"/g, '\\"')}" | python3 /code/solution.py`
    }
    const inputFile = path.join(tmpDir, 'input.txt')
    fs.writeFileSync(inputFile, input)
    const dockerCmd = language === 'cpp'
      ? `docker run --rm --memory=256m --cpus=1 -v "${tmpDir}:/code" ${image} sh -c "${compileCmd} && /tmp/solution < /code/input.txt"`
      : `docker run --rm --memory=256m --cpus=1 -v "${tmpDir}:/code" ${image} sh -c "python3 /code/solution.py < /code/input.txt"`
    exec(dockerCmd, { timeout: 15000 }, (err, stdout, stderr) => {
      fs.rmSync(tmpDir, { recursive: true })
      if (err) {
        if (err.killed) resolve({ output: '', error: 'TLE' })
        else resolve({ output: '', error: stderr || 'RE' })
      } else {
        resolve({ output: stdout.trim(), error: null })
      }
    })
  })
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