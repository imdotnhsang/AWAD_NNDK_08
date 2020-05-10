const mongoose = require('mongoose')
const config = require('config')
const db = config.get('mongoURI')

// //  "mongoURI":"mongodb://admin:a123456@ds337718.mlab.com:37718/eight-db-test"
// // "mongoURI":"mongodb://localhost:27017/daw"

const connectDB = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })

        console.log("MongoDB Connected...")
    } catch (err) {
        console.error(err.message)

        //Exit process with failure
        process.exit(1)
    }
}

module.exports = connectDB