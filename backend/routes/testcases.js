const express = require('express')
const router = express.Router()
const TestCase = require('../models/TestCase')
const authMiddleware = require('../middlewares/auth')

router.post('/', authMiddleware, async (req, res) => {
  try {
    const testCase = new TestCase(req.body)
    await testCase.save()
    res.status(201).json(testCase)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/:problemId', async (req, res) => {
  try {
    const testCases = await TestCase.find({ problemId: req.params.problemId })
    res.status(200).json(testCases)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router