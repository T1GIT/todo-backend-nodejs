module.exports = {
    keyLength: {
        jwt: 40,
        refresh: 30,
        cookie: 40,
        salt: 12
    },
    expirePeriod: {
        jwt: 10, // minutes
        refresh: 60 // days
    }
}