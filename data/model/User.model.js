const mongoose = require('mongoose')
const UserSchema = require('../schema/User.schema')


module.exports = mongoose.model('User', UserSchema)
