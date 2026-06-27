const express = require('express')
const router = express.Router()
const Submission = require('../models/Submission')
const User = require('../models/User')

router.get('/', async (req, res) => {
  try {
    // Count unique AC submissions per user
    const results = await Submission.aggregate([
      { $match: { verdict: 'AC' } },
      { $group: { _id: '$userId', solvedCount: { $addToSet: '$problemId' } } },
      { $project: { solvedCount: { $size: '$solvedCount' } } },
      { $sort: { solvedCount: -1 } }
    ])

    // Get user details
    const leaderboard = await Promise.all(results.map(async (r) => {
      const user = await User.findById(r._id).select('firstName lastName')
      return { ...user.toObject(), solvedCount: r.solvedCount }
    }))

    res.status(200).json(leaderboard)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router