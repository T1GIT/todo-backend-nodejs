const manager = require('../../../data/manager/memory.manager')
const userService = require('../../../data/service/user.service')
const { KEY_LENGTH } = require('../../../middleware/security/config')
const User = require('../../../data/model/User.model')


describe("User service", () => {

    beforeAll(manager.connect)
    afterAll(manager.disconnect)

    const profile = {
        correct: {
            email: 'right-email@mail.ru',
            psw: 'right-password1',
        },
        invalid: {
            email: 'bad email.mail.ru@',
            psw: 'bad-psw'
        },
        another: {
            email: 'another-email@mail.ru',
            psw: 'another-password1'
        },
        additional: {
            name: 'Ivan',
            surname: 'Ivanovich',
            patronymic: 'Ivanov',
            birthdate: new Date(1970, 1, 1)
        }
    }

    describe("creating", () => {
        afterEach(manager.clear)

        describe("can be done with", () => {
            describe("short info", () => {
                const form = { ...profile.correct }

                it("doesn't throw", () => expect(
                        userService.create(form)
                    ).resolves.not.toThrow())

                it("returns valid user", async () => {
                    const user = await userService.create(form)
                    expect(user).toBeDefined()
                    expect(user.email).toBe(form.email)
                })
            })

            describe("full info", () => {
                const form = { ...profile.correct, ...profile.additional }

                it("doesn't throw", () => expect(
                        userService.create(form)
                    ).resolves.not.toThrow())

                it("returns valid user", async () => {
                    const user = await userService.create(form)
                    expect(user).toBeDefined()
                    expect(user.email).toBe(form.email)
                    expect(user.name).toBe(form.name)
                    expect(user.surname).toBe(form.surname)
                    expect(user.patronymic).toBe(form.patronymic)
                    expect(user.birthdate).toBe(form.birthdate)
                })
            })
        })

        describe("can not be done", () => {
            describe("if form contains invalid", () => {
                it("email", () => expect(
                    userService.create({
                        email: profile.invalid.email,
                        psw: profile.correct.psw
                    })
                ).rejects.toThrow())
                it("password", () => expect(
                    userService.create({
                        email: profile.correct.email,
                        psw: profile.invalid.psw
                    })
                ).rejects.toThrow())
            })

            it("if email already exists", async () => {
                const form = { ...profile.correct }

                await userService.create(form)
                await expect(
                    userService.create(form)
                ).rejects.toThrow()
            })
        })
    })

    describe("checking", () => {
        const form = { ...profile.correct }

        beforeAll(async () => {
            await manager.clear()
            return await userService.create(form);
        })
        afterAll(manager.clear)

        describe("can be done", () => {
            it("without throwing", () => expect(
                userService.check(form)
            ).resolves.not.toThrow())

            it("and returns valid user", async () => {
                const user = await userService.check(form)
                expect(user).toBeDefined()
                expect(user.email).toBe(form.email)
            })
        })

        describe("can not be done", () => {

            describe("if form contains invalid", () => {
                it("email", () => expect(
                    userService.check({
                        email: profile.invalid.email,
                        psw: profile.correct.psw
                    })
                ).rejects.toThrow())
                it("password", () => expect(
                    userService.check({
                        email: profile.correct.email,
                        psw: profile.invalid.psw
                    })
                ).rejects.toThrow())
            })

            describe("if form contains wrong", () => {
                it("email", () => expect(
                    userService.check({
                        email: profile.another.email,
                        psw: profile.correct.psw
                    })
                ).rejects.toThrow())
                it("password", () => expect(
                    userService.check({
                        email: profile.correct.email,
                        psw: profile.another.psw
                    })
                ).rejects.toThrow())
            })
        })
    })
})
