const manager = require('../../../data/manager/memory.manager')
const userService = require('../../../data/service/user.service')
const sessionService = require('../../../data/service/session.service')
const User = require('../../../data/model/User.model')
const { MAX_SESSIONS } = require('../../../data/config')


describe("Session service", () => {

    beforeAll(manager.connect)
    afterAll(manager.disconnect)

    const form = {
        email: 'right-email@mail.ru',
        psw: 'right-password1',
    }

    const fingerprint = 'fingerprint'

    describe('creating', () => {
        let user

        beforeEach(async () => user = await userService.create(form))
        afterEach(manager.clean)

        describe('can be done', () => {
            it('without throwing', () => expect(
                sessionService.create(user._id, fingerprint)
            ).resolves.not.toThrow())

            it('and returns valid refresh', async () => {
                const refresh = await sessionService.create(user._id, fingerprint)
                expect(refresh).toBeDefined()
                expect(typeof refresh === 'string').toBeTruthy()
                await expect(
                    sessionService.existsActive(refresh, fingerprint)
                ).resolves.toBeTruthy()
            })
        })
    })

    describe('update', () => {
        let user
        let refresh

        beforeEach(async () => {
            user = await userService.create(form)
            refresh = await sessionService.create(user._id, fingerprint)
        })
        afterEach(manager.clean)

        describe('works', () => {
            it('without throwing', () => expect(
                sessionService.update(refresh, fingerprint)
            ).resolves.not.toThrow())

            it('and changes only current session', async () => {
                const newRefresh = await sessionService.update(refresh, fingerprint)
                await expect(
                    sessionService.existsActive(refresh, fingerprint)
                ).resolves.toBeFalsy()
                await expect(
                    sessionService.existsActive(newRefresh, fingerprint)
                ).resolves.toBeTruthy()
            })
        })
    })

    describe('existsActive', () => {
        let user
        let refresh

        beforeEach(async () => {
            user = await userService.create(form)
            refresh = await sessionService.create(user._id, fingerprint)
        })
        afterEach(manager.clean)

        describe('works correctly', () => {
            describe('if it got', () => {
                it('right arguments', () => expect(
                    sessionService.existsActive(refresh, fingerprint)
                ).resolves.toBeTruthy())

                describe('wrong', () => {
                    it('fingerprint', () => expect(
                        sessionService.existsActive(
                            refresh,
                            'wrong' + fingerprint)
                    ).resolves.toBeFalsy())

                    it('refresh', () => expect(
                        sessionService.existsActive(
                            'wrong' + refresh,
                            fingerprint)
                    ).resolves.toBeFalsy())
                })


            })

            it('after updating session', async () => {
                const newRefresh = await sessionService.update(refresh, fingerprint)
                await expect(
                    sessionService.existsActive(refresh, fingerprint)
                ).resolves.toBeFalsy()
                await expect(
                    sessionService.existsActive(newRefresh, fingerprint)
                ).resolves.toBeTruthy()
            })
        })
    })

    describe('remove', () => {
        let user

        beforeEach(async () => user = await userService.create(form))
        afterEach(manager.clean)

        describe('works correctly with', () => {
            it('normal session', async () => {
                const refresh = await sessionService.create(user._id, fingerprint)
                await sessionService.remove(refresh, fingerprint)
                await expect(
                    sessionService.existsActive(refresh, fingerprint)
                ).resolves.toBeFalsy()
            })

            it('repeated fingerprint', async () => {
                const amount = 10
                let refresh
                for (let i = 0; i < amount; i++)
                    refresh = await sessionService.create(user._id, fingerprint)
                await sessionService.remove(refresh, fingerprint)
                await expect(
                    User.exists({ _id: user._id, 'sessions.fingerprint': fingerprint })
                ).resolves.toBeFalsy()
            })
        })
    })

    describe('clean', () => {
        let user

        beforeEach(async () => user = await userService.create(form))
        afterEach(manager.clean)

        describe('works with', () => {
            it('repeated fingerprint in different sessions', async () => {
                const amount = 10
                for (let i = 0; i < amount; i++)
                    await sessionService.create(user._id, fingerprint)
                await sessionService.clean.fingerprint(user._id, fingerprint)
                await expect(
                    User.exists({ _id: user._id, 'sessions.fingerprint': fingerprint })
                ).resolves.toBeFalsy()
            })

            it('overflowing of sessions', async () => {
                const amount = MAX_SESSIONS + 5
                for (let i = 0; i < amount; i++)
                    await sessionService.create(user._id, fingerprint + i)
                await sessionService.clean.overflow(user._id)
                expect(
                    (await User.findById(user._id).select('sessions')).sessions
                ).toHaveLength(MAX_SESSIONS)
            })

            it('outdated sessions', async () => {
                const amount = 5
                for (let i = 0; i < amount; i++)
                    await sessionService.create(user._id, fingerprint + i)
                await User.updateOne(
                    { _id: user._id },
                    { $set: { 'sessions.$[].expires': new Date(0) } })
                await sessionService.clean.outdated()
                expect(
                    (await User.findById(user._id).select('sessions')).sessions
                ).toHaveLength(0)
            })
        })
    })
})
