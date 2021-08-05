const jwtProvider = require('../security/token-providers/jwt')


module.exports = (req, res, next) => {
    const jwt = jwtProvider.extract(req)
    req.user = jwtProvider.parse(jwt)
    next()
}
