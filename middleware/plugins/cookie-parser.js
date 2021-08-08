const cookieParser = require('cookie-parser')
const { KEY_LENGTH } = require('../security/config')
const { nanoid } = require('nanoid')

const cookieKey = nanoid(KEY_LENGTH.COOKIE)

module.exports = cookieParser(cookieKey)
