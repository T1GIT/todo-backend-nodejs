const mongoose = require('mongoose')
const SessionSchema = require('../schema/Session.schema')


module.exports = new mongoose.Schema({
    email: {
        index: true,
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    psw: {
        type: String,
        required: true,
        select: false
    },
    name: {
        type: String,
        trim: true,
    },
    surname: {
        type: String,
        trim: true,
    },
    patronymic: {
        type: String,
        trim: true,
    },
    birthdate: Date,
    role: {
        type: String,
        required: true,
        enum: ['ADMIN', 'BASIC'],
        default: 'BASIC',
        select: false
    },
    sessions: {
        type: [SessionSchema],
        select: false
    },
    categories: {
        type: [{ type: mongoose.Types.ObjectId, ref: 'Category' }],
        select: false
    },
}, { versionKey: false })
