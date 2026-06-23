const express = require('express')
const router = express.Router()
const Problem = require('../models/Problem')
const authMiddleware = require('../middlewares/auth')

// Get all problems
router.get('/', async (req, res) => {
  try {
    const { difficulty } = req.query
    const filter = difficulty ? { difficulty } : {}
    const problems = await Problem.find(filter).select('title difficulty tags createdAt')
    res.status(200).json(problems)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get single problem
router.get('/:id', async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id)
    if (!problem) return res.status(404).json({ message: 'Problem not found' })
    res.status(200).json(problem)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Add problem (admin only - we'll add proper RBAC later)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const problem = new Problem(req.body)
    await problem.save()
    res.status(201).json(problem)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router