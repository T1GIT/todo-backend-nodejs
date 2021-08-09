const mongoose = require('mongoose')
const SessionSchema = require('../schema/Session.schema')


module.exports = new mongoose.Schema({
    email: {
        index: true,
        type: String,
        required: true,
        unique: true,
        minlength: 7,
        maxlength: 255,
        lowercase: true,
    },
    psw: {
        type: String,
        required: true,
        select: false
    },
    name: {
        type: String,
        trim: true,
        minlength: 1,
        maxlength: 50,
        validate: /^[a-zA-Zа-яА-Я]*$/,
    },
    surname: {
        type: String,
        trim: true,
        minlength: 1,
        maxlength: 50,
        validate: /^[a-zA-Zа-яА-Я]*$/
    },
    patronymic: {
        type: String,
        trim: true,
        minlength: 1,
        maxlength: 50,
        validate: /^[a-zA-Zа-яА-Я]*$/,
    },
    birthdate: {
        type: Date,
        validate: birthdate => birthdate < new Date()
    },
    role: {
        type: String,
        required: true,
        enum: ['ADMIN', 'BASIC'],
        default: 'BASIC'
    },
    sessions:{
        type: [SessionSchema],
        select: false
    },
    categories: {
        type: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'Category'
            }
        ],
        select: false
    }
}, {versionKey: false})
