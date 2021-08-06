const mongoose = require('mongoose')
const CategorySchema = require('../schema/Category.schema')


module.exports = new mongoose.model('Category', CategorySchema)
