const mongoose = require('mongoose')
const bcrypt = require("bcrypt");
const { KEY_LENGTH } = require("../../middleware/security/config");
const UserSchema = require('../schema/User.schema')


module.exports = mongoose.model('User', UserSchema)
