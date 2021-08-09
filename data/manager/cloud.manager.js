const mongoose = require('mongoose')
const env = require('../../environment')
const config = require('../config')
const _ = require('lodash')


const connect = async () => {
    const uri = `mongodb+srv://${env.DB_USERNAME}:${env.DB_PASSWORD}@express-nodejs.jk9vv.mongodb.net/${env.DB_NAME}`
    await mongoose.connect(uri, config.OPTIONS)
}

const disconnect = async () => {
    await mongoose.connection.close()
}

const clean = async () => {
    const collections = mongoose.connection.collections
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
    }
}

const connection = mongoose.connection


module.exports = { connect, disconnect, clean, connection }