const mongoose = require('mongoose')
const TaskSchema = require('../schema/Task.schema')


module.exports = new mongoose.Schema({
    name: {
        type: String,
        minlength: 0,
        maxlength: 100
    },
    tasks: {
        type: [TaskSchema],
        select: false
    }
}, {versionKey: false})
