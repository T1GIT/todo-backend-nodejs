const mongoose = require('mongoose')
const validator = require('validator').default
const SessionSchema = require('../schemas/Session')


const schema = new mongoose.Schema({
    email: {
        index: true,
        type: String,
        required: true,
        unique: true,
        minlength: 7,
        maxlength: 255,
        lowercase: true,
        validate: validator.isEmail
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
        maxlength: 50
    },
    surname: {
        type: String,
        trim: true,
        minlength: 1,
        maxlength: 50
    },
    patronymic: {
        type: String,
        trim: true,
        minlength: 1,
        maxlength: 50
    },
    birthdate: Date,
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
    categories: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Category'
        }
    ]
})


module.exports = mongoose.model('User', schema)
