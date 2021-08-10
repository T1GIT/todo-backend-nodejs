const jwtProvider = require('../security/token-providers/jwt.prowider')


module.exports = (req, res, next) => {
    req.user = jwtProvider.extract(req)
    next()
}
