const { KEY_LENGTH,  } = require('../config')
const bcrypt = require('bcrypt')



class HashProvider {
    async create(psw) {
        return bcrypt.hashSync(psw, KEY_LENGTH.SALT)
    }

    async check(psw, hash) {
        return bcrypt.compareSync(psw, hash)
    }
}

module.exports = new HashProvider()
