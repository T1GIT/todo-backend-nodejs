const dotenv = require('dotenv')
const { NODE_ENV } = process.env

let path

switch (NODE_ENV) {
    case 'production':
        path = '.env.production'; break
    case 'test':
        path = '.env.test'; break
    default:
        path = '.env'; break
}

dotenv.config({ path })

const {HOST, PORT, DB_NAME, DB_USERNAME, DB_PASSWORD, ACCEPT_ORIGIN, CONTEXT_PATH } = process.env

module.exports = {
    NODE_ENV,
    HOST, PORT, CONTEXT_PATH,
    DB_NAME, DB_USERNAME, DB_PASSWORD,
    ACCEPT_ORIGIN
}