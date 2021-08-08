const manager = require("../../../data/manager/memory.manager");
const userService = require('../../../data/service/user.service')
const categoryService = require('../../../data/service/category.service')
const Category = require('../../../data/model/Category.model')


const form = {
    email: 'right-email@mail.ru',
    psw: 'right-password1',
}

const category = {
    name: 'category-name'
}

describe('Category service', () => {
    let user

    beforeAll(manager.connect)
    afterAll(manager.disconnect)

    beforeEach(async () => {
        await manager.clear()
        user = await userService.create(form)
    })

    it('gets category', async () => {
        const amount = 5
        for (let i = 0; i < amount; i++) {
            await categoryService.create(user._id, category)
        }

        await expect(
            categoryService.getByUser(user._id)
        ).resolves.toHaveLength(amount)
    })

    it('creates category', async () => {
        const categoryId = await categoryService.create(user._id, category)

        await expect(
            Category.exists({ _id: categoryId })
        ).resolves.toBeTruthy()
    })

    it('updates category', async () => {
        const categoryId = await categoryService.create(user._id, category)
        const name = 'another name'

        await categoryService.update(categoryId, { name })

        await expect(
            Category.exists({ _id: categoryId, name })
        ).resolves.toBeTruthy()
    })

    it('removes category', async () => {
        const amount = 5
        const categoryIds = []
        for (let i = 0; i < amount; i++)
            categoryIds.push(await categoryService.create(user._id, category))

        for (let categoryId of categoryIds)
            await categoryService.remove(categoryId)

        await expect(
            categoryService.getByUser(user._id)
        ).resolves.toHaveLength(0)
    })
})



