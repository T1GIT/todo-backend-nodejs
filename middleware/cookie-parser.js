const cookieParser = require('cookie-parser')
const { keyLength } = require('../security/config')
const { nanoid } = require('nanoid')

const cookieKey = nanoid(keyLength.cookie)

module.exports = cookieParser(cookieKey)
