const { nanoid } = require('nanoid')
const { keyLength } = require('./config.json')


module.exports = {}

for (const key in keyLength) {
    module.exports[key] = () => nanoid(keyLength[key])
}
