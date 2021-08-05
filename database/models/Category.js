const mongoose = require('mongoose')
const TaskSchema = require('../schemas/Task')


const schema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 0,
        maxlength: 100
    },
    tasks: [TaskSchema]
})


module.exports = new mongoose.model('Category', schema)
