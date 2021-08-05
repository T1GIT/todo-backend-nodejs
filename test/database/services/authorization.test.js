const manager = require('../../../database/manager/manager-in-memory')
const authorizationService = require('../../../database/services/authorization')


describe("Authorization service", () => {
    beforeAll(manager.connect)
    afterEach(manager.clear)
    afterAll(manager.disconnect)


    describe("lets register with normal", () => {
        it("short data", () => {
            expect(async () => await authorizationService.register(
                { ...profile.right },
                fingerprint
            ))
                .resolves
                .not
                .toThrow()
        })
        it("full data", () => {
            expect(async () => await authorizationService.register(
                { ...profile.right, ...profile.additional },
                fingerprint
            ))
                .resolves
                .not
                .toThrow()
        })
    })

    describe("doesn't let register with wrong", () => {
        it("email", () => {
            expect(async () => await authorizationService.register({
                email: profile.wrong.email,
                psw: profile.right.psw
            }, fingerprint))
                .rejects
                .toThrow()
        })
        it("password", () => {
            expect(async () => await authorizationService.register({
                email: profile.right.email,
                psw: profile.wrong.psw
            }, fingerprint))
                .rejects
                .toThrow()
        })
    })
});


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
