const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server');

const memoryServer = new MongoMemoryServer();


const connect = async () => {

    await memoryServer.start()

    const uri = memoryServer.getUri()

    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    }

    await mongoose.connect(uri, options)
}

const disconnect = async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    await memoryServer.stop()
}

const clear = async () => {
    const collections = mongoose.connection.collections

    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany();
    }
}


module.exports = { connect, disconnect, clear }
