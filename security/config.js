module.exports = {
    KEY_LENGTH: {
        REFRESH: 50,
        SALT: 12
    },
    EXPIRE_PERIOD: {
        JWT: 24 * 60, // minutes PROD: 20
        REFRESH: 60 // days
    }
}
