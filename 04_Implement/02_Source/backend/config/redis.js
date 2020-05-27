const redis = require('redis')
const config = require('config')

const redisClient = redis.createClient(config.get('redisURI'))

module.exports = redisClient