const mongoose = require('mongoose')
const TaskSchema = require('../schema/Task.schema')


const schema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 0,
        maxlength: 100
    },
    tasks: [TaskSchema]
})


module.exports = new mongoose.model('Category', schema)
