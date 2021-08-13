const jwtProvider = require('../../security/provider/jwt.provider')


module.exports = async (req, res, next) => {
    try {
        req.authId = await jwtProvider.extract(req)
        next()
    } catch (e) {
        next({
            code: 401,
            name: e.name,
            msg: e.message
        })
    }
}
