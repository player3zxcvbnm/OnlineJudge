const { Queue } = require('bullmq')
const IORedis = require('ioredis')

const connection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null
})

const submissionQueue = new Queue('submissions', { connection })

module.exports = submissionQueue