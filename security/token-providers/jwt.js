const jsonwebtoken = require('jsonwebtoken')
const env = require('../../environment')
const { nanoid } = require('nanoid')
const { keyLength, expirePeriod } = require('../config')


const options = {

}

let jwtKey = nanoid(keyLength.jwt)

function updateKey() {
    jwtKey = nanoid(keyLength.jwt)
}

async function create(user) {
    return await jsonwebtoken.sign(
        { payload: user },
        jwtKey,
        { expiresIn: expirePeriod.jwt })
}

async function parse(jwt) {
    return jsonwebtoken.verify(
        jwt,
        jwtKey,
        { maxAge: expirePeriod.jwt }
    );
}

async function extract(req) {
    return parse(req.header('authorization').replace('Bearer ', ''))
}


module.exports = { updateKey, create, extract }
