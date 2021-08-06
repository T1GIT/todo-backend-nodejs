const mongoose = require('mongoose')
const env = require('../../environment')
const options = require('./config')


const connect = async () => {
    const uri = `mongodb+srv://${env.DB_USERNAME}:${env.DB_PASSWORD}@express-nodejs.jk9vv.mongodb.net/${env.DB_NAME}`
    await mongoose.connect(uri, options)
}

const disconnect = async () => await mongoose.connection.close()

const clear = async () => {
    const collections = mongoose.connection.collections
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany();
    }
}

const connection = mongoose.connection


module.exports = { connect, disconnect, clear, connection }