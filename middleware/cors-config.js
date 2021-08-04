const cors = require("cors");
const env = require("../environment");


module.exports = cors({
    origin: env.ACCEPT_ORIGIN,
    exposedHeaders: ['location'],
    maxAge: 60 * 60 * 24
})
