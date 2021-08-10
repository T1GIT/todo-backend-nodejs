const User = require('./data/model/User.model')
const Category = require('./data/model/Category.model')
const userService = require('./data/service/user.service')
const categoryService = require('./data/service/category.service')
const sessionService = require('./data/service/session.service')
const taskService = require('./data/service/task.service')


module.exports = async () => {

    const category = await Category.create({ name: 'jfiejfh' })
    for (let i = 0; i < 5; i++) {
        await Category.updateOne(
            { _id: category._id },
            {
                $push: {
                    tasks: {
                        title: 'title' + i,
                        description: 'desc' + i
                    }
                }
            }
        )
    }
    console.log(await Category.findById(category).select('tasks'))
    console.log(await Category.findById(category)
        .select({
            tasks: {
                $elemMatch: {
                    title: 'title2',
                    description: 'desc2'
                }
            }
        }))
}