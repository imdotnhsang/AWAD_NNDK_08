const mongoose = require('mongoose')
const config = require('config')
const db = config.get('mongoURI')

// //  "mongoURI":"mongodb://admin:a123456@ds051841.mlab.com:51841/test-mongoose"

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