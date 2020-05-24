/* eslint-disable no-undef */
const express = require('express')
const connectDB = require('./config/db')

const app = express()


// Connect Datavase
connectDB()

// Init Middleware
app.use(express.json({ extended: false }))

app.get('/', (req, res) => {
	res.send('API Running')
})

// Defined Routes
app.use('/customers', require('./routes/api/customers'))
app.use('/receivers', require('./routes/api/receivers'))
app.use('/staffs', require('./routes/api/staffs'))
app.use('/debt-collections', require('./routes/api/debtCollections'))
app.use('/auth', require('./routes/api/auth'))
app.use('/accounts', require('./routes/api/accounts'))
app.use('/transactions', require('./routes/api/transactions'))
app.use('/linked-bank', require('./routes/api/linkedBank'))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`)
})
