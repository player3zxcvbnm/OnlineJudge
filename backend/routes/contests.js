const express = require('express')
const router = express.Router()
const Contest = require('../models/Contest')
const authMiddleware = require('../middlewares/auth')

// Create contest
router.post('/', authMiddleware, async (req, res) => {
  try {
    const contest = new Contest(req.body)
    await contest.save()
    res.status(201).json(contest)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// List all contests
router.get('/', async (req, res) => {
  try {
    const { status } = req.query
    const now = new Date()
    let filter = {}
    
    if (status === 'live') filter = { startTime: { $lte: now }, endTime: { $gte: now } }
    if (status === 'archived') filter = { endTime: { $lt: now } }
    if (status === 'upcoming') filter = { startTime: { $gt: now } }

    const contests = await Contest.find(filter).sort({ startTime: -1 })
    res.status(200).json(contests)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get single contest with problems populated
router.get('/:id', async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id).populate('problems', 'title difficulty')
    if (!contest) return res.status(404).json({ message: 'Contest not found' })
    res.status(200).json(contest)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router