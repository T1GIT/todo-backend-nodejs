const mongoose = require('mongoose')
const validator = require('validator').default
const SessionSchema = require('../schema/Session.schema')
const bcrypt = require("bcrypt");
const { keyLength } = require("../../middleware/security/config");


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
        select: false,
        validate: (psw) => validator.matches(psw, '^(?=.*[0-9])(?=.*[a-zA-ZА-Яа-я])(?=.*\\W*).{8,}$')
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

schema.pre('save', async function () {
    this.psw = bcrypt.hashSync(this.psw, keyLength.salt)
})

schema.method('isValidPsw', function (psw) {
    return bcrypt.compareSync(psw, this.psw)
})


module.exports = mongoose.model('User', schema)
