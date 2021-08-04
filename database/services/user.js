const User = require('../models/User')


const create = async (user) => {
    await User.create(user)
}

module.exports = {
    create
}
