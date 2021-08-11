const jwtProvider = require('../../security/provider/jwt.provider')


module.exports = async (error, req, res, next) => {
    res.status(error.code).json({ error })
}
