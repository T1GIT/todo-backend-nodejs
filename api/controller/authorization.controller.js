const sessionService = require('../../data/service/session.service')
const userService = require('../../data/service/user.service')
const { NoActiveSessions } = require("../../util/http-error");


async function register(user, fingerprint) {
    user = await userService.create(user)
    const refresh = await sessionService.create(user, fingerprint)
    return { user, refresh }
}

async function login(user, fingerprint) {
    user = await userService.check(user)
    await sessionService.clean.fingerprint(user, fingerprint)
    const refresh = await sessionService.create(user, fingerprint)
    await sessionService.clean.overflow(user)
    return { user, refresh }
}

async function refresh(refresh, fingerprint) {
    if (! await sessionService.existsActive(refresh, fingerprint)) {
        await sessionService.clean.outdated()
        await sessionService.remove(refresh, fingerprint)
        throw new NoActiveSessions()
    }
    return sessionService.update(refresh)
}

async function logout(refresh) {
    await sessionService.remove(refresh)
}


module.exports = { register, login, refresh, logout }
