const jsonwebtoken = require('jsonwebtoken')
const env = require('../../environment')
const { JwtError } = require("../../util/http-error");
const { nanoid } = require('nanoid')
const { KEY_LENGTH, EXPIRE_PERIOD } = require('../config')



class JwtProvider {
    secret = nanoid(KEY_LENGTH.JWT)

    updateKey() {
        this.secret = nanoid(KEY_LENGTH.JWT)
    }

    async create(user) {
        try {
            return await jsonwebtoken.sign(
                { payload: user },
                this.secret,
                { expiresIn: EXPIRE_PERIOD.JWT * 60 })
        } catch (e) {
            throw new JwtError(`(${e.name}) ${e.message}`)
        }
    }

    parse(jwt) {
        try {
            return jsonwebtoken.verify(
                jwt,
                this.secret,
                { maxAge: EXPIRE_PERIOD.JWT * 60 }
            );
        } catch (e) {
            throw new JwtError(`(${e.name}) ${e.message}`)
        }
    }

    extract(req) {
        const authorization = req.header('authorization')
        if (!authorization)
            throw new JwtError("can't find bearer authorization token")
        return this.parse(authorization.slice(7))
    }
}

module.exports = new JwtProvider()
