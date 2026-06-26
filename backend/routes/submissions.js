const express = require('express')
const router = express.Router()
const Submission = require('../models/Submission')
const authMiddleware = require('../middlewares/auth')
const submissionQueue = require('../queue/submissionQueue')

// Submit code
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { problemId, code, language } = req.body

    const submission = new Submission({
      userId: req.user.userId,
      problemId,
      code,
      language,
      verdict: 'PENDING'
    })

    await submission.save()
    await submissionQueue.add('submission', { submissionId: submission._id })
    res.status(201).json({ submissionId: submission._id, verdict: 'PENDING' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get submissions for a user
router.get('/user/:userId', authMiddleware, async (req, res) => {
  try {
    const submissions = await Submission.find({ userId: req.params.userId })
      .populate('problemId', 'title difficulty')
      .sort({ createdAt: -1 })
    res.status(200).json(submissions)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
    if (!submission) return res.status(404).json({ message: 'Not found' })
    res.status(200).json(submission)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router