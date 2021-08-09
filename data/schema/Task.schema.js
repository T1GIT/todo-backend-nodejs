const mongoose = require('mongoose')


module.exports = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 0,
        maxlength: 255
    },
    description: {
        type: String,
        minlength: 0,
        maxlength: 1000,
    },
    completed: {
        type: Boolean,
        required: true,
        default: false
    },
    executeDate: Date
}, {versionKey: false})

