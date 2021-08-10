module.exports = {
    KEY_LENGTH: {
        JWT: 40,
        REFRESH: 50,
        COOKIE: 40,
        SALT: 12
    },
    EXPIRE_PERIOD: { // TODO: May transform to config.json
        JWT: 10, // minutes
        REFRESH: 60 // days
    }
}