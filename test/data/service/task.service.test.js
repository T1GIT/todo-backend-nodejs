const manager = require("../../../data/manager/memory.manager");
const userService = require('../../../data/service/user.service')
const categoryService = require('../../../data/service/category.service')
const taskService = require('../../../data/service/task.service')
const Category = require('../../../data/model/Category.model')


const form = {
    email: 'right-email@mail.ru',
    psw: 'right-password1',
}

const category = {
    name: 'category-name'
}

const task = {
    title: 'task-title',
    description: 'task-description'
}

describe('Task service', () => {
    let user
    let categoryId

    beforeAll(manager.connect)
    afterAll(manager.disconnect)

    beforeEach(async () => {
        await manager.clean()
        user = await userService.create(form)
        categoryId = await categoryService.create(user._id, category)
    })

    it('gets tasks', async () => {
        const amount = 5
        for (let i = 0; i < amount; i++)
            await taskService.create(categoryId, task)

        await expect(
            taskService.getByCategory(categoryId)
        ).resolves.toHaveLength(amount)
    })

    it('creates task', async () => {
        const taskId = await taskService.create(categoryId, task)

        await expect(
            Category.exists({ 'tasks._id': taskId })
        ).resolves.toBeTruthy()
    })

    it('updates task', async () => {
        const taskId = await taskService.create(categoryId, task)

        const anotherTask = {
            title: task.title + 'another',
            description: task.description + 'another'
        }

        await taskService.update(taskId, anotherTask)

        await expect(
            Category.exists({
                _id: categoryId,
                'tasks.title': anotherTask.title,
                'tasks.description': anotherTask.description
            })
        ).resolves.toBeTruthy()
    })

    it('updates task completed', async () => {
        const taskId = await taskService.create(categoryId, task)

        await taskService.updateCompleted(taskId, true)

        const foundTask = (await Category
            .findById(categoryId)
            .select({ tasks: {$elemMatch: {_id: taskId}} })).tasks[0]

        expect(foundTask.completed).toBeTruthy()
        expect(foundTask.executeDate).toBeDefined()
    })

    it('removes task', async () => {
        const amount = 5
        const taskIds = []
        for (let i = 0; i < amount; i++)
            taskIds.push(await taskService.create(categoryId, task))

        await expect(
            taskService.getByCategory(categoryId)
        ).resolves.toHaveLength(amount)

        for (let taskId of taskIds)
            await taskService.remove(taskId)

        await expect(
            taskService.getByCategory(categoryId)
        ).resolves.toHaveLength(0)
    })
})



