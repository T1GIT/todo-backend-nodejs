const mongoose = require('mongoose')


module.exports = mongoose.model(
    'Session',
    new mongoose.Schema({
        expires: {
            type: Date,
            required: true
        },
        fingerprint: {
            index: true,
            type: String,
            required: true,
            immutable: true
        },
        refresh: {
            index: true,
            type: String,
            required: true,
            unique: true
        }
    }))