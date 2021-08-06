const mongoose = require('mongoose')
const validator = require('validator').default
const SessionSchema = require('../schema/Session.schema')
const bcrypt = require("bcrypt");
const { InvalidPsw } = require("../../util/http-error");
const { InvalidEmail } = require("../../util/http-error");
const { KEY_LENGTH } = require("../../middleware/security/config");


module.exports = new mongoose.Schema({
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
