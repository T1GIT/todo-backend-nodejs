const corsConfig = require('./cors-config')
const authorization = require('./authorization')
const { errorHandler } = require('./error-handler')
const bodyParser = require('./body-parser')
const cookieParser = require('./cookie-parser')


module.exports = { corsConfig, authorization, errorHandler, bodyParser, cookieParser }
