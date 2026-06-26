const { Queue } = require('bullmq')

const connection = {
  host: '127.0.0.1',
  port: 6379
}

const submissionQueue = new Queue('submissions', { connection })

module.exports = submissionQueue