const express = require('express')
const router = express.Router()
const { exec } = require('child_process')
const fs = require('fs')
const path = require('path')
const os = require('os')
const authMiddleware = require('../middlewares/auth')

const runCode = (code, language, input) => {
  return new Promise((resolve) => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'oj-exec-'))
    let filename, image, compileCmd, runCmd
    if (language === 'cpp') {
      filename = path.join(tmpDir, 'solution.cpp')
      fs.writeFileSync(filename, code)
      image = 'gcc'
      compileCmd = `g++ -o /tmp/solution /code/solution.cpp`
      runCmd = `/tmp/solution < /code/input.txt`
    } else if (language === 'python') {
      filename = path.join(tmpDir, 'solution.py')
      fs.writeFileSync(filename, code)
      image = 'python:3.11-slim'
      runCmd = `python3 /code/solution.py < /code/input.txt`
    } else if (language === 'javascript') {
      filename = path.join(tmpDir, 'solution.js')
      fs.writeFileSync(filename, code)
      image = 'node:18-slim'
      runCmd = `node /code/solution.js < /code/input.txt`
    }
    const inputFile = path.join(tmpDir, 'input.txt')
    fs.writeFileSync(inputFile, input || '')
    const dockerCmd = language === 'cpp'
      ? `docker run --rm --memory=256m --cpus=1 -v "${tmpDir}:/code" ${image} sh -c "${compileCmd} && ${runCmd}"`
      : `docker run --rm --memory=256m --cpus=1 -v "${tmpDir}:/code" ${image} sh -c "${runCmd}"`
    exec(dockerCmd, { timeout: 30000 }, (err, stdout, stderr) => {
      fs.rmSync(tmpDir, { recursive: true })
      if (err) {
        if (err.killed) resolve({ output: '', error: 'Time Limit Exceeded' })
        else resolve({ output: '', error: stderr || 'Runtime Error' })
      } else {
        resolve({ output: stdout, error: null })
      }
    })
  })
}

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { code, language, input } = req.body
    const result = await runCode(code, language, input)
    if (result.error) {
      return res.status(200).json({ output: result.error, isError: true })
    }
    res.status(200).json({ output: result.output, isError: false })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router