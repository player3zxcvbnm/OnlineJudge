const express = require('express')
const router = express.Router()
const Submission = require('../models/Submission')
const User = require('../models/User')
const Contest = require('../models/Contest')

router.get('/:contestId', async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.contestId)
    if (!contest) return res.status(404).json({ message: 'Contest not found' })

    const problemIds = contest.problems

    const results = await Submission.aggregate([
      { 
        $match: { 
          verdict: 'AC', 
          problemId: { $in: problemIds },
          createdAt: { $gte: contest.startTime, $lte: contest.endTime }
        } 
      },
      { $sort: { createdAt: 1 } },
      { 
        $group: { 
          _id: '$userId', 
          solvedProblems: { $addToSet: '$problemId' },
          lastSolveTime: { $max: '$createdAt' }
        } 
      },
      { $project: { solvedCount: { $size: '$solvedProblems' }, lastSolveTime: 1 } },
      { $sort: { solvedCount: -1, lastSolveTime: 1 } }
    ])

    const leaderboard = await Promise.all(results.map(async (r) => {
      const user = await User.findById(r._id).select('firstName lastName')
      return { ...user.toObject(), solvedCount: r.solvedCount, lastSolveTime: r.lastSolveTime }
    }))

    res.status(200).json(leaderboard)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router