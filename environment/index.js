const { NODE_ENV } = process.env

require('dotenv').config({
    path: NODE_ENV === 'production' ? './.env.production' : './.env'
})

const {HOST, PORT, DB_NAME, DB_USERNAME, DB_PASSWORD, ACCEPT_ORIGIN } = process.env

module.exports = {
    HOST, PORT,
    DB_NAME, DB_USERNAME, DB_PASSWORD,
    ACCEPT_ORIGIN
}