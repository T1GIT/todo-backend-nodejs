const env = require("../environment")


module.exports = {
    url: `mongodb+srv://${env.DB_USERNAME}:${env.DB_PASSWORD}@express-nodejs.jk9vv.mongodb.net/${env.DB_NAME}`,
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    }
}