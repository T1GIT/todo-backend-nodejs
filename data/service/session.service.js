const { EXPIRE_PERIOD } = require("../../middleware/security/config");
const { KEY_LENGTH } = require("../../middleware/security/config");
const User = require("../model/User.model")
const { nanoid } = require("nanoid");
const config = require("../../middleware/data/config")


class SessionCleaner {
        async fingerprint(user, fingerprint) { await User.updateOne(
            user,
            { $pull: { sessions: { fingerprint } } }
        )}
        async overflow(user) {
            const sessions = (await User.findById(user).select('+sessions')).sessions
            if (sessions.length > config.maxSessions) {
                await User.updateOne(
                    user,
                    { $set: { sessions: sessions.slice(sessions.length - config.maxSessions) } }
                )
            }
        }
        async outdated() {
            const date = new Date()
            await User.updateOne(
                { 'sessions.expires': { $lt: date } },
                { $pull: { sessions: { expires: { $lt: date } } } }
            );
        }
        async abort(refresh, fingerprint) {
            await User.updateMany({
                    $or: [
                        { 'sessions.refresh': refresh },
                        { 'sessions.fingerprint': fingerprint }
                    ]
                },
                { $pull: { sessions: { $or: [{ refresh }, { fingerprint }] } } }
            )}
}

class SessionService {

    clean = new SessionCleaner()

    async create(user, fingerprint) {
        const refresh = nanoid(KEY_LENGTH.REFRESH)
        const date = new Date()
        const session = {
            expires: date.setDate(date.getDate() + EXPIRE_PERIOD.REFRESH),
            refresh, fingerprint
        }
        await User.updateOne(
            user,
            { $push: { sessions: session } }
        )
        return refresh
    }
}

module.exports = new SessionService()
