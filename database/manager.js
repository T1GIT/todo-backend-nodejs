const mongoose = require('mongoose')
const env = require('../environment')


const connect = async () => {

    const uri = `mongodb+srv://${env.DB_USERNAME}:${env.DB_PASSWORD}@express-nodejs.jk9vv.mongodb.net/${env.DB_NAME}`

    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    }

    await mongoose.connect(uri, options)
}

const close = async () => await mongoose.connection.close()

const clear = async () => {
    const collections = mongoose.connection.collections

    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany();
    }
}


module.exports = { connect, close, clear }