const User = require('../model/User.model')
const { nanoid } = require('nanoid')
const SessionService = require('./session.service')
const { NoActiveSessions, WrongPsw, EmailNotExists, EmailAlreadyExists } = require("../../util/http-error");
const { KEY_LENGTH, EXPIRE_PERIOD } = require('../../middleware/security/config')


async function register(user, fingerprint) {
    const { email, psw, name, surname, patronymic, birthdate } = user
    if (await User.exists({ email }))
        throw new EmailAlreadyExists(email)
    user = await User.create({ email, psw, name, surname, patronymic, birthdate, })
    const refresh = await SessionService.create(user, fingerprint)
    return { user, refresh }
}

async function login(user, fingerprint) {
    const { email, psw } = user
    if (!await User.exists({ email }))
        throw new EmailNotExists(email)
    user = await User.findOne({ email }).select('+psw')
    if (!user.checkPsw(psw))
        throw new WrongPsw(psw)
    await SessionService.clean.fingerprint(user, fingerprint)
    await SessionService.clean.overflow(user)
    const refresh = await SessionService.create(user, fingerprint)
    return { user, refresh }
}

async function refresh(refresh, fingerprint) {
    const date = new Date()
    if (! await User.exists({
        'sessions.expires': { $gt: date },
        'sessions.refresh': refresh,
        'sessions.fingerprint': fingerprint
    })) {
        await SessionService.clean.outdated()
        await SessionService.clean.abort(refresh, fingerprint)
        throw new NoActiveSessions()
    }
    const newRefresh = nanoid(KEY_LENGTH.REFRESH)
    await User.updateOne(
        { 'sessions.refresh': refresh },
        {
            $set: {
                sessions: {
                    refresh: newRefresh,
                    expires: date.setDate(date.getDate() + EXPIRE_PERIOD.REFRESH)
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
