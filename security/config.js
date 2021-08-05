module.exports = {
    keyLength: {
        jwt: 40,
        refresh: 30,
        cookie: 40
    },
    expirePeriod: {
        jwt: 60 * 10,
        refresh: 60 * 60 * 24 * 60
    }
}