const mongoose = require('mongoose')
const TaskSchema = require('../schema/Task.schema')


module.exports = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    tasks: {
        type: [TaskSchema],
        select: false
    }
}, {versionKey: false})
