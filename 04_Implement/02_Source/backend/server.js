/* eslint-disable no-undef */
const express = require('express')
const cookieParser = require('cookie-parser')

const connectDB = require('./config/mongodb')
const redisClient = require('./config/redis')

const app = express()

app.use((req, res, next) => {
	// Website you wish to allow to connect
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')

	// Request methods you wish to allow
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, OPTIONS, PUT, PATCH, DELETE'
	)

	// Request headers you wish to allow
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization'
	)

	// Set to true if you need the website to include cookies in the requests sent
	// to the API (e.g. in case you use sessions)
	res.setHeader('Access-Control-Allow-Credentials', true)

	// Pass to next layer of middleware
	next()
})

// Connect Database
connectDB()

redisClient.on('connect', () => {
	console.log('Redis Client Connected')
})

redisClient.on('error', (error) => {
	console.log('Redis not connected', error)
})

// Init Middleware
app.use(express.json({ extended: false }))

app.use(cookieParser())

app.get('/', (req, res) => {
	res.send('API Running')
})

// Defined Routes
app.use('/customers', require('./routes/api/customers'))
app.use('/receivers', require('./routes/api/receivers'))
app.use('/employees', require('./routes/api/employees'))
app.use('/administrators', require('./routes/api/administrators'))
app.use('/staffs', require('./routes/api/staffs'))
app.use('/debt-collections', require('./routes/api/debtCollections'))
app.use('/notifications', require('./routes/api/notifications'))
app.use('/auth', require('./routes/api/auth'))
app.use('/accounts', require('./routes/api/accounts'))
app.use('/transactions', require('./routes/api/transactions'))
app.use('/linked-banks', require('./routes/api/linkedBanks'))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`)
})
