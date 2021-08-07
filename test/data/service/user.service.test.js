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

    describe("create", () => {
        afterEach(manager.clear)

        describe("can be done with", () => {
            describe("short info", () => {
                it("doesn't throw", () => expect(
                    userService.create(form)
                ).resolves.not.toThrow())

                it("returns valid user", async () => {
                    const user = await userService.create(form)
                    expect(user).toBeDefined()
                    await expect(
                        User.exists({ _id: user._id, ..._.without(form, 'psw') })
                    ).resolves.toBeTruthy()
                })
            })

            describe("full info", () => {
                const formWithInfo = { ...form, ...info }

                it("doesn't throw", () => expect(
                    userService.create(formWithInfo)
                ).resolves.not.toThrow())

                it("returns valid user", async () => {
                    const user = await userService.create(formWithInfo)
                    expect(user).toBeDefined()
                    await expect(
                        User.exists({ _id: user._id, ..._.without(formWithInfo, 'psw') })
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

    describe("checkAndGet", () => {
        const formWithInfo = { ...form, ...info }

        beforeAll(async () => {
            await manager.clear()
            await userService.create(formWithInfo);
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

    describe("changeEmail", () => {
        let userId

        beforeEach(async () => {
            await manager.clear()
            userId = (await userService.create(form))._id;
        })
        afterAll(manager.clear)

        describe("with valid email", () => {
            const anotherEmail = 'another' + form.email

            it("doesn't throw", async () => {
                await expect(
                    userService.changeEmail(userId, anotherEmail)
                ).resolves.not.toThrow()
            })

            describe("after change", () => {
                it("database info has been updated", async () => {
                    await userService.changeEmail(userId, anotherEmail)
                    await expect(
                        User.exists({ email: anotherEmail })
                    ).resolves.toBeTruthy()
                })

                it("you can login with a new email", async () => {
                    await userService.changeEmail(userId, anotherEmail)
                    await expect(
                        userService.checkAndGet({
                            ...form,
                            email: anotherEmail
                        })
                    ).resolves.not.toThrow()
                })
            })
        })

        it("fails with invalid email", async () => {
            await expect(
                userService.changeEmail(userId, 'invalid')
            ).rejects.toThrow()
        })
    })

    describe("changePsw", () => {
        let userId

        beforeEach(async () => {
            await manager.clear()
            userId = (await userService.create(form))._id;
        })
        afterAll(manager.clear)

        describe("with valid password", () => {
            const anotherPsw = 'another' + form.psw

            it("doesn't throw", async () => {
                await expect(
                    userService.changePsw(userId, anotherPsw)
                ).resolves.not.toThrow()
            })

            it("after change you can login with a new password", async () => {
                await userService.changePsw(userId, anotherPsw)
                await expect(
                    userService.checkAndGet({
                        ...form,
                        psw: anotherPsw
                    })
                ).resolves.not.toThrow()
            })
        })

        it("fails with invalid password", async () => {
            await expect(
                userService.changePsw(userId, 'invalid')
            ).rejects.toThrow()
        })
    })

    describe("changeInfo", () => {
        let userId

        beforeEach(async () => {
            await manager.clear()
            userId = (await userService.create(form))._id;
        })
        afterAll(manager.clear)


        describe("with valid info", () => {
            it("doesn't throw", async () => {
                await expect(
                    userService.changeInfo(userId, info)
                ).resolves.not.toThrow()
            })

            it("all changes are saved", async () => {
                await userService.changeInfo(userId, info)
                await expect(
                    User.exists({ _id: userId, ..._.without(form, 'psw'), ...info })
                ).resolves.toBeTruthy()
            })
        })

        describe("fails with invalid", () => {
            it("name", () => expect(
                userService.changeInfo(userId, { name: '123' })
            ).rejects.toThrow())

            it("surname", () => expect(
                userService.changeInfo(userId, { surname: '123' })
            ).rejects.toThrow())

            it("patronymic", () => expect(
                userService.changeInfo(userId, { patronymic: '123' })
            ).rejects.toThrow())

            it("birthdate", async () => {
                const date = new Date()
                await expect(
                    userService.changeInfo(userId, { birthdate: date.setDate(date.getDate() + 1) })
                ).rejects.toThrow()
            })
        })

        it("can't change role", async () => {
            await User.findByIdAndUpdate({ _id: userId }, { role: 'BASIC' })
            await userService.changeInfo(userId, { role: 'ADMIN' })
            await expect(
                User.exists({ _id: userId, role: 'ADMIN' })
            ).resolves.toBeFalsy()
        })
    })
})
