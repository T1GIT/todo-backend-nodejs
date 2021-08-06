const UserService = require('../model/User.model')


const create = async (user) => {
    await UserService.create(user)
}

module.exports = {
    create
}
