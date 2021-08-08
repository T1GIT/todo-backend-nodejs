const mongoose = require('mongoose')
const CategorySchema = require('../schema/Category.schema')


module.exports = mongoose.model('Category', CategorySchema)
