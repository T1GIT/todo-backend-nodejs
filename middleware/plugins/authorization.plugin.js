const jwtProvider = require('../../security/provider/jwt.provider')


module.exports = async (req, res, next) => {
    try {
        req.authId = await jwtProvider.extract(req)
        next()
    } catch ({ name, message }) {
        next({
            code: 401,
            name,
            msg: message
        })
    }
}
