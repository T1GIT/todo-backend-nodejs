const manager = require('../../../data/manager/memory.manager')
const userService = require('../../../data/service/user.service')
const { KEY_LENGTH } = require('../../../middleware/security/config')
const User = require('../../../data/model/User.model')
const _ = require('lodash')


describe("User service", () => {

    beforeAll(manager.connect)
    afterAll(manager.disconnect)
    
    const form = {
        email: 'right-email@mail.ru',
        psw: 'right-password1',
    }
    
    const info = {
        name: 'Ivan',
        surname: 'Ivanovich',
        patronymic: 'Ivanov',
        birthdate: new Date(1970, 12, 31)
    }

    describe("creating", () => {
        afterEach(manager.clear)

        describe("can be done with", () => {
            describe("short info", () => {
                it("doesn't throw", () => expect(
                        userService.create(form)
                    ).resolves.not.toThrow())

                it("returns valid user", async () => {
                    const { _id } = await userService.create(form)
                    await expect(
                        User.exists({ _id, ..._.without(form, 'psw')})
                    ).resolves.toBeTruthy()
                })
            })

            describe("full info", () => {
                const formWithInfo = { ...form, ...info }

                it("doesn't throw", () => expect(
                        userService.create(formWithInfo)
                    ).resolves.not.toThrow())

                it("returns valid user", async () => {
                    const { _id } = await userService.create(formWithInfo)
                    await expect(
                        User.exists({ _id, ..._.without(formWithInfo, 'psw')})
                    ).resolves.toBeTruthy()
                })
            })
        })

        describe("can not be done", () => {
            describe("if form contains invalid", () => {
                it("email", () => expect(
                    userService.create({
                        ...form,
                        email: "invalid",
                    })
                ).rejects.toThrow())
                it("password", () => expect(
                    userService.create({
                        ...form,
                        psw: 'invalid'
                    })
                ).rejects.toThrow())
            })

            it("if email already exists", async () => {
                await userService.create(form)
                await expect(
                    userService.create(form)
                ).rejects.toThrow()
            })
        })
    })

    describe("checking", () => {
        const formWithInfo = { ...form, ...info }

        beforeAll(async () => {
            await manager.clear()
            return await userService.create(formWithInfo);
        })
        afterAll(manager.clear)

        describe("can be done", () => {
            it("without throwing", () => expect(
                userService.checkAndGet(form)
            ).resolves.not.toThrow())

            it("and returns valid user", async () => {
                const user = await userService.checkAndGet(formWithInfo)
                const props = _.without(_.keys(formWithInfo), 'psw')
                expect(user).toBeDefined()
                expect(_.pick(user, ...props)).toEqual(_.pick(formWithInfo, ...props))
            })
        })

        describe("can not be done", () => {
            describe("if form contains invalid", () => {
                it("email", () => expect(
                    userService.checkAndGet({
                        ...form,
                        email: 'invalid',
                    })
                ).rejects.toThrow())
                it("password", () => expect(
                    userService.checkAndGet({
                        ...form,
                        psw: 'invalid'
                    })
                ).rejects.toThrow())
            })

            describe("if form contains wrong", () => {
                it("email", () => expect(
                    userService.checkAndGet({
                        ...form,
                        email: 'another' + form.email
                    })
                ).rejects.toThrow())
                it("password", () => expect(
                    userService.checkAndGet({
                        ...form,
                        psw: 'another' + form.psw
                    })
                ).rejects.toThrow())
            })
        })
    })
})
