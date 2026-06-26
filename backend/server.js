const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())

// Routes
const authRoutes = require('./routes/auth')
app.use('/api/auth', authRoutes)

const problemRoutes = require('./routes/problems')
app.use('/api/problems', problemRoutes)

const submissionRoutes = require('./routes/submissions')
app.use('/api/submissions', submissionRoutes)

const testCaseRoutes = require('./routes/testcases')
app.use('/api/testcases', testCaseRoutes)

app.get('/', (req, res) => {
  res.send('Server is running')
})

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
  family: 4
})
  .then(() => {
    console.log('MongoDB connected')
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`)
    })
  })
  .catch((err) => console.log(err))