const { NODE_ENV } = process.env

require('dotenv').config({
    path: NODE_ENV === 'production' ? './.env.production' : './.env'
})

const {HOST, PORT, DB_NAME, DB_USERNAME, DB_PASSWORD, ACCEPT_ORIGIN, CONTEXT_PATH } = process.env

module.exports = {
    NODE_ENV,
    HOST, PORT, CONTEXT_PATH,
    DB_NAME, DB_USERNAME, DB_PASSWORD,
    ACCEPT_ORIGIN
}