const mongoose = require('mongoose')
const TaskSchema = require('../schema/Task.schema')


module.exports = new mongoose.Schema({
    name: String,
    tasks: {
        type: [TaskSchema],
        select: false
    }
}, {versionKey: false})
