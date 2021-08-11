module.exports = {
    corsConfig: require('./plugins/cors-config'),
    authorization: require('./authorization'),
    bodyParser: require('./plugins/body-parser'),
    cookieParser: require('./plugins/cookie-parser')
}
