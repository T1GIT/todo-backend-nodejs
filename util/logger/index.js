const winston = require('winston')

const { format: {combine, timestamp, prettyPrint}, transports: {File} } = winston
const config = require('./config')


module.exports = winston.createLogger(winston.createLogger({
    format: combine(
        timestamp({ format: 'DD-MM-YYYY HH:mm' }),
        prettyPrint()
    ),
    transports: [
        new File({
            filename: 'error' + config.EXT,
            dirname: config.DIR
        })
    ]
}))
