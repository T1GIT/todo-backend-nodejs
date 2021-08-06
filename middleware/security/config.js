module.exports = {
    KEY_LENGTH: {
        JWT: 40,
        REFRESH: 30,
        COOKIE: 40,
        SALT: 12
    },
    EXPIRE_PERIOD: {
        JWT: 10, // minutes
        REFRESH: 60 // days
    }
}