const mongoose = require('mongoose')
const bcrypt = require("bcrypt");
const { KEY_LENGTH } = require("../../middleware/security/config");
const UserSchema = require('../schema/User.schema')


UserSchema.pre('save', async function () {
    this.psw = bcrypt.hashSync(this.psw, KEY_LENGTH.SALT)
})


module.exports = mongoose.model('User', UserSchema)
