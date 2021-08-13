const mongoose = require('mongoose')


module.exports = new mongoose.Schema({
    title: String,
    description: String,
    completed: {
        type: Boolean,
        required: true,
        default: false
    },
    executeDate: Date
}, {versionKey: false})

