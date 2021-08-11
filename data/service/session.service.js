const { EXPIRE_PERIOD } = require("../../security/config");
const { KEY_LENGTH } = require("../../security/config");
const User = require("../model/User.model")
const { nanoid } = require("nanoid");
const config = require("../config")
const { SessionError } = require("../../util/http-error");


class SessionCleaner {
    async overflow(userId) {
        const sessions = (await User.findById(userId).select('sessions')).sessions
        if (sessions.length > config.MAX_SESSIONS) {
            await User.updateOne(
                { _id: userId },
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

    async create(userId, fingerprint) {
        const refresh = nanoid(KEY_LENGTH.REFRESH)
        const date = new Date()
        await User.updateOne(
            { _id: userId },
            {
                $push: {
                    sessions: {
                        expires: date.setDate(date.getDate() + EXPIRE_PERIOD.REFRESH),
                        refresh, fingerprint
                    }
                }
            },
            { runValidators: true }
        )
        return refresh
    }

    async refresh(refresh, fingerprint) {
        const user = await User
            .findOne({ 'sessions.refresh': refresh })
            .select({ sessions: { $elemMatch: { refresh } } })
        if (!user)
            throw new SessionError("Can't find session with refresh " + refresh)
        const session = user.sessions[0]
        if (session.fingerprint !== fingerprint)
            throw new SessionError(`Fingerprint ${ fingerprint } is invalid`)
        if (session.expires < new Date())
            throw new SessionError('Session is expired')
        const newRefresh = nanoid(KEY_LENGTH.REFRESH)
        const date = new Date()
        const updatedUser = await User.findOneAndUpdate(
            { 'sessions._id': session._id },
            {
                $set: {
                    'sessions.$.refresh': newRefresh,
                    'sessions.$.expires': date.setDate(date.getDate() + EXPIRE_PERIOD.REFRESH)
                }
            },
            { runValidators: true }).select('_id').lean()
        return {
            refresh: newRefresh,
            userId: updatedUser._id
        }
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
