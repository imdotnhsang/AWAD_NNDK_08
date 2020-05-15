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
app.use('/users', require('./routes/api/users'))
app.use('/profile', require('./routes/api/profile'))
app.use('/auth', require('./routes/api/auth'))
app.use('/accounts', require('./routes/api/accounts'))
app.use('/transactions', require('./routes/api/transactions'))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})
