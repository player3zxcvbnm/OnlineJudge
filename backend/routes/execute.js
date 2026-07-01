const express = require('express')
const router = express.Router()
const axios = require('axios')
const authMiddleware = require('../middlewares/auth')

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
      stdin: input || ''
    }, { timeout: 15000 })

    const result = res.data.run

    if (result.signal === 'SIGKILL' || result.code === 124) {
      return { output: '', error: 'Time Limit Exceeded' }
    }
    if (result.stderr && result.stderr.trim()) {
      return { output: '', error: result.stderr }
    }
    return { output: result.stdout, error: null }
  } catch (err) {
    return { output: '', error: 'Runtime Error' }
  }
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