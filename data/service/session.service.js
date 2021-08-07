const { EXPIRE_PERIOD } = require("../../middleware/security/config");
const { KEY_LENGTH } = require("../../middleware/security/config");
const User = require("../model/User.model")
const { nanoid } = require("nanoid");
const config = require("../config")


class SessionCleaner {
    async fingerprint(fingerprint) {
        await User.updateMany(
            { 'sessions.fingerprint': fingerprint },
            { $pull: { sessions: { fingerprint } } }
        )
    }

    async overflow(user) {
        const sessions = (await User.findById(user).select('+sessions')).sessions
        if (sessions.length > config.MAX_SESSIONS) {
            await User.findByIdAndUpdate(
                user,
                { $set: { sessions: sessions.slice(sessions.length - config.MAX_SESSIONS) } }
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
        await User.findByIdAndUpdate(
            user,
            { $push: { sessions: session } },
            { runValidators: true }
        )
        return refresh
    }

    async update(refresh, fingerprint) {
        const newRefresh = nanoid(KEY_LENGTH.REFRESH)
        const date = new Date()
        await User.updateOne(
            {
                'sessions.refresh': refresh,
                'sessions.fingerprint': fingerprint
            },
            {
                $set: {
                    'sessions.$.refresh': newRefresh,
                    'sessions.$.expires': date.setDate(date.getDate() + EXPIRE_PERIOD.REFRESH)
                }
            },
            { runValidators: true })
        return newRefresh
    }

    async existsActive(refresh, fingerprint) {
        return await User.exists({
            'sessions.expires': { $gt: new Date() },
            'sessions.refresh': refresh,
            'sessions.fingerprint': fingerprint
        })
    }

    async remove(refresh, fingerprint) {
        await User.updateOne(
            { 'sessions.refresh': refresh },
            {
                $pull: {
                    sessions: {
                        $or: [
                            { refresh },
                            { fingerprint }
                        ]
                    }
                }
            }
        )
    }
}

module.exports = new SessionService()
