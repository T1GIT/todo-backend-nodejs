const manager = require('../../../database/manager/manager-in-memory')
const authorizationService = require('../../../database/services/authorization')
const { keyLength } = require('../../../security/config')


describe("Authorization service", () => {

    beforeAll(manager.connect)
    afterAll(manager.disconnect)

    const fingerprint = "fingerprint"
    const profile = {
        right: {
            email: 'right-email@mail.ru',
            psw: 'right-password1',
        },
        wrong: {
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

    describe("register", () => {

        afterEach(manager.clear)

        describe("registers normal data", () => {
            describe("short info", () => {

                afterEach(manager.clear)

                it("doesn't throw", async () => await expect(
                    authorizationService.register({ ...profile.right }, fingerprint))
                    .resolves.not.toThrow())

                describe("returns valid", () => {

                    let res

                    beforeAll(async () => res = await authorizationService.register({ ...profile.right }, fingerprint))

                    it("user", () => {
                        let { user } = res
                        expect(user).toBeDefined()
                        expect(user._id).toBeDefined()
                        expect(user.email).toEqual(profile.right.email)
                        expect(user.role).toBeDefined()
                    })

                    it("refresh", () => {
                        let { refresh } = res
                        expect(refresh).toBeDefined()
                        expect(refresh.length).toEqual(keyLength.refresh)
                        expect(typeof refresh === 'string').toBeTruthy()
                    })
                })
            })

            describe("full info", () => {

                afterEach(manager.clear)

                it("doesn't throw", async () => await expect(
                    authorizationService.register({ ...profile.right, ...profile.additional }, fingerprint))
                    .resolves.not.toThrow())

                describe("returns valid", () => {

                    let res

                    beforeAll(async () => res = await authorizationService.register({ ...profile.right, ...profile.additional }, fingerprint))

                    it("user", () => {
                        let { user } = res
                        expect(user).toBeDefined()
                        expect(user._id).toBeDefined()
                        expect(user.email).toEqual(profile.right.email)
                        expect(user.name).toEqual(profile.additional.name)
                        expect(user.surname).toEqual(profile.additional.surname)
                        expect(user.patronymic).toEqual(profile.additional.patronymic)
                        expect(user.birthdate).toEqual(profile.additional.birthdate)
                        expect(user.role).toBeDefined()
                    })

                    it("refresh", () => {
                        let { refresh } = res
                        expect(refresh).toBeDefined()
                        expect(refresh.length).toEqual(keyLength.refresh)
                        expect(typeof refresh === 'string').toBeTruthy()
                    })
                })
            })
        })

        describe("doesn't register", () => {
            describe("with incorrect", () => {
                it("email", async () => {
                    await expect(async () => await authorizationService.register({
                        email: profile.wrong.email,
                        psw: profile.right.psw
                    }, fingerprint))
                        .rejects.toThrow()
                })
                it("password", async () => {
                    await expect(async () => await authorizationService.register({
                        email: profile.right.email,
                        psw: profile.wrong.psw
                    }, fingerprint))
                        .rejects.toThrow()
                })
            })

            it("if email already exists", async () => {
                await authorizationService.register({ ...profile.right }, fingerprint)
                await expect(async () => await authorizationService.register({ ...profile.right }, fingerprint))
                    .rejects.toThrow()
            })
        })
    })

    describe("login", () => {

        afterEach(manager.clear)

        describe("with normal data", () => {

            beforeAll(async () => await authorizationService.register({ ...profile.right }, fingerprint))

            it("doesn't throw", async () => await expect(
                authorizationService.login({ ...profile.right }, fingerprint))
                .resolves.not.toThrow())

            describe("returns valid", () => {

                let res

                beforeAll(async () => {
                    await authorizationService.register({ ...profile.right }, fingerprint)
                    res = await authorizationService.login({ ...profile.right }, fingerprint);
                })

                it("user", () => {
                    let { user } = res
                    expect(user).toBeDefined()
                    expect(user._id).toBeDefined()
                    expect(user.email).toEqual(profile.right.email)
                    expect(user.role).toBeDefined()
                })

                it("refresh", () => {
                    let { refresh } = res
                    expect(refresh).toBeDefined()
                    expect(typeof refresh === 'string').toBeTruthy()
                })
            })
        })

        describe("doesn't with", () => {

            beforeAll(async () => await authorizationService.register({ ...profile.right }, fingerprint))

            describe("invalid", () => {
                it("email", async () => {
                    await expect(async () => await authorizationService.login({
                        email: profile.another.email,
                        psw: profile.right.psw
                    }, fingerprint))
                        .rejects.toThrow()
                })
                it("password", async () => {
                    await expect(async () => await authorizationService.login({
                        email: profile.right.email,
                        psw: profile.another.psw
                    }, fingerprint))
                        .rejects.toThrow()
                })
            })

            describe("incorrect", () => {
                it("email", async () => {
                    await expect(async () => await authorizationService.login({
                        email: profile.wrong.email,
                        psw: profile.right.psw
                    }, fingerprint))
                        .rejects.toThrow()
                })
                it("password", async () => {
                    await expect(async () => await authorizationService.login({
                        email: profile.right.email,
                        psw: profile.wrong.psw
                    }, fingerprint))
                        .rejects.toThrow()
                })
            })
        })
    })

    describe("refresh", () => {

        let res

        beforeAll(async () => res = await authorizationService.register({ ...profile.right }, fingerprint))
        afterEach(async () => res = await authorizationService.login({ ...profile.right }, fingerprint))

        describe("does", () => {

            it("without error", async () =>
                await expect(authorizationService.refresh(res.refresh, fingerprint))
                    .resolves.not.toThrow()
            )

            it("returns new refresh", async () => {
                let refresh = await authorizationService.refresh(res.refresh, fingerprint)
                expect(refresh).toBeDefined()
                expect(refresh.length).toEqual(keyLength.refresh)
                expect(typeof refresh).toBeTruthy()
            })
        })

        describe("doesn't if is invalid", () => {
            it("refresh", async () =>
                await expect(authorizationService.refresh('!' + res.refresh, fingerprint))
                    .rejects.toThrow())

            it("fingerprint", async () =>
                await expect(authorizationService.refresh(res.refresh, '!' + fingerprint))
                    .rejects.toThrow())
        })
    })
})
