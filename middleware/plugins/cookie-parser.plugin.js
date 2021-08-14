const cookieParser = require('cookie-parser')
const env = require('../../environment')


module.exports = cookieParser(env.COOKIE_SECRET)
