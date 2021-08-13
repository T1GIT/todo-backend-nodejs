const jsonwebtoken = require('jsonwebtoken')
const { JwtError } = require("../../util/http-error");
const env = require('../../environment')


function parse(jwt) {
    return jsonwebtoken.verify(
        jwt,
        env.JWT_SECRET,
        { maxAge: EXPIRE_PERIOD.JWT * 60 }
    );
}


class JwtProvider {
    async create(userId) {
        return await jsonwebtoken.sign(
            { payload: userId },
            env.JWT_SECRET,
            { expiresIn: EXPIRE_PERIOD.JWT * 60 })
    }

    async extract(req) {
        const authorization = req.header('authorization')
        if (!authorization)
            throw new JwtError("can't find bearer authorization token")
        return parse(authorization.slice(7)).payload
    }
}

module.exports = new JwtProvider()
