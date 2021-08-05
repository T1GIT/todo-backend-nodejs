const jsonwebtoken = require('jsonwebtoken')
const env = require('../../environment')
const { nanoid } = require('nanoid')
const { keyLength, expirePeriod } = require('../config')


const expiresIn = expirePeriod.jwt * 60

let jwtKey = nanoid(keyLength.jwt)

function updateKey() {
    jwtKey = nanoid(keyLength.jwt)
}

async function create(user) {
    return await jsonwebtoken.sign(
        { payload: user },
        jwtKey,
        { expiresIn: expiresIn })
}

async function parse(jwt) {
    return jsonwebtoken.verify(
        jwt,
        jwtKey,
        { maxAge: expiresIn }
    );
}

async function extract(req) {
    return req.header('authorization').replace('Bearer ', '')
}


module.exports = { updateKey, create, extract, parse }
