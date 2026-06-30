const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const authMiddleware = require('../middlewares/auth')

// Register
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword
    })

    await user.save()

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(201).json({ token, userId: user._id })

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(200).json({ token, userId: user._id })

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Profile (protected)
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password')
    res.status(200).json(user)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Stats (protected)
router.get('/stats/:userId', authMiddleware, async (req, res) => {
  try {
    const Submission = require('../models/Submission')
    const Problem = require('../models/Problem')
    const Contest = require('../models/Contest')

    const userId = req.params.userId

    const allSubmissions = await Submission.find({ userId })
    const acSubmissions = allSubmissions.filter(s => s.verdict === 'AC')
    const uniqueSolvedIds = [...new Set(acSubmissions.map(s => s.problemId.toString()))]

    const solvedProblems = await Problem.find({ _id: { $in: uniqueSolvedIds } })
    const difficultyBreakdown = {
      Easy: solvedProblems.filter(p => p.difficulty === 'Easy').length,
      Medium: solvedProblems.filter(p => p.difficulty === 'Medium').length,
      Hard: solvedProblems.filter(p => p.difficulty === 'Hard').length
    }

    const contestsParticipated = await Contest.countDocuments({
      problems: { $in: uniqueSolvedIds }
    })

    res.status(200).json({
      totalSubmissions: allSubmissions.length,
      totalSolved: uniqueSolvedIds.length,
      acceptanceRate: allSubmissions.length > 0 ? ((acSubmissions.length / allSubmissions.length) * 100).toFixed(1) : 0,
      difficultyBreakdown,
      contestsParticipated
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router