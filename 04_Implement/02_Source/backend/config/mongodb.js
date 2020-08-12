const mongoose = require('mongoose')
const config = require('config')

// //  "mongoURI":"mongodb://admin:a123456@ds337718.mlab.com:37718/eight-db-test"
// // "mongoURI":"mongodb://localhost:27017/daw"

const connectDB = async () => {
	try {
		await mongoose.connect(config.get('mongoURISuperFast_demo'), {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
			useCreateIndex: true
		})

		console.log('MongoDB Connected...')
	} catch (err) {
		console.error(err.message)

		// Exit process with failure
		// eslint-disable-next-line no-undef
		process.exit(1)
	}
}


module.exports = connectDB
