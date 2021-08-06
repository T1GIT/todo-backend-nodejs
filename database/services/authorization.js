const User = require('../models/User')
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

const sessionCleaner = {
    fingerprint: async (user, fingerprint) => await User.updateOne(
        user,
        { $pull: { sessions: { fingerprint } } }
    ),
    overflow: async (user) => {
        const sessions = (await User.findById(user).select('+sessions')).sessions
        if (sessions.length > config.maxSessions) {
            await User.updateOne(
                user,
                { $set: { sessions: sessions.slice(sessions.length - config.maxSessions) } }
            )
        }
    },
    outdated: async () => {
        const date = new Date()
        await User.updateOne(
            { 'sessions.expires': { $lt: date } },
            { $pull: { sessions: { expires: { $lt: date } } } }
        );
    },
    abort: async (refresh, fingerprint) =>
        await User.updateMany({
                $or: [
                    { 'sessions.refresh': refresh },
                    { 'sessions.fingerprint': fingerprint }
                ]
            },
            { $pull: { sessions: { $or: [{ refresh }, { fingerprint }] } } }
        )
}

async function register(user, fingerprint) {
    const { email, psw, name, surname, patronymic, birthdate } = user
    if (await User.exists({ email }))
        throw new HttpError(409, 'Email already exists')
    user = await User.create({ email, psw, name, surname, patronymic, birthdate, })
    const refresh = await addSession(user, fingerprint)
    return { user, refresh }
}

async function login(user, fingerprint) {
    const { email, psw } = user
    if (!await User.exists({ email }))
        throw new HttpError(404, 'Email not found ')
    user = await User.findOne({ email }).select('+psw')
    if (!user.isValidPsw(psw))
        throw new HttpError(401, 'Invalid password')
    await sessionCleaner.fingerprint(user, fingerprint)
    await sessionCleaner.overflow(user)
    const refresh = await addSession(user, fingerprint)
    return { user, refresh }
}

async function refresh(refresh, fingerprint) {
    const date = new Date()
    const session = await User.findOne({
        'sessions.expires': { $gt: date },
        'sessions.refresh': refresh,
        'sessions.fingerprint': fingerprint
    })
    if (!session) {
        await sessionCleaner.outdated()
        await sessionCleaner.abort(refresh, fingerprint)
        throw new HttpError(401, "Not have active sessions")
    }
    const newRefresh = nanoid(keyLength.refresh)
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
