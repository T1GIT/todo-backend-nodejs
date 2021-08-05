const User = require('../models/User')
const bcrypt = require('bcrypt')
const { HttpError } = require("../../middleware/error-handler");
const { nanoid } = require('nanoid')
const config = require('../config')
const { keyLength, expirePeriod } = require('../../security/config')


async function addSession(user, fingerprint) {
    const refresh = nanoid(keyLength.refresh)
    const date = new Date()
    const session = {
        expires: date.setDate(date.getDate() + expirePeriod.refresh),
        refresh, fingerprint
    }
    await User.updateOne(
        user,
        { $push: { sessions: session } }
    )
    return refresh
}

async function clearSessions(user, fingerprint) {
    // Deletes sessions with the same fingerprint
    await User.updateOne(
        user,
        { $pull: { sessions: { fingerprint } } }
    )
    // Deletes old sessions if total amount more then maxSessions
    const sessions = (await User.findById(user).select('+sessions')).sessions
    if (sessions.length > config.maxSessions) {
        await User.updateOne(
            user,
            { $set: { sessions: sessions.slice(sessions.length - config.maxSessions) } }
        )
    }
}

async function register(user, fingerprint) {
    const { email, psw, name, surname, patronymic, birthdate } = user
    if (await User.exists({ email }))
        throw new HttpError(409, 'Email already exists')
    user = await User.create({
        psw: bcrypt.hashSync(psw, keyLength.salt),
        email, name, surname, patronymic, birthdate,
    })
    const refresh = await addSession(user, fingerprint)
    return { user, refresh }
}

async function login(user, fingerprint) {
    const { email, psw } = user
    if (!await User.exists({ email }))
        throw new HttpError(404, 'Email not found ')
    user = await User.findOne({ email }).select('+psw')
    if (!bcrypt.compareSync(psw, user.psw))
        throw new HttpError(401, 'Invalid password')
    await clearSessions(user, fingerprint)
    const refresh = await addSession(user, fingerprint)
    return { user, refresh }
}

async function refresh(refresh) {
    const newRefresh = nanoid(keyLength.refresh)
    const date = new Date()
    await User.updateOne(
        { 'sessions.refresh': refresh },
        {
            $set: {
                sessions: {
                    refresh: newRefresh,
                    expires: date.setDate(date.getDate() + expirePeriod.refresh)
                }
            }
        }
    )
    return newRefresh
}

async function logout(refresh) {
    await User.updateOne(
        { 'sessions.refresh': refresh },
        { $pull: { sessions: { refresh } } }
    )
}


module.exports = { register, login, refresh, logout }
