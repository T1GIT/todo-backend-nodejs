const sessionService = require('../../data/service/session.service')
const userService = require('../../data/service/user.service')
const AbstractController = require("../../util/AbstractController");
const { InvalidEmail, InvalidPsw } = require("../../util/http-error");
const { NoActiveSessions, NotFound, EmailAlreadyExists, BadRequest, EmailNotExists } = require("../../util/http-error");
const jwtProvider = require('../../security/token-providers/jwt.prowider')
const refreshProvider = require('../../security/token-providers/refresh.provider')
const _ = require('lodash')


const pswRegExp = '^(?=.*[0-9])(?=.*[a-zA-ZА-Яа-я])(?=.*\\W*).{8,}$'

function validateEmail(email) {
    if (!validator.isEmail(email))
        throw new InvalidEmail(email)
}

function validatePsw(psw) {
    if (!validator.matches(psw, pswRegExp))
        throw new InvalidPsw(psw)
}

async function checkIdExists(userId) {
    if (!await userService.existsById(userId))
        throw new NotFound(`user with id ${userId}`)
}

async function checkEmailExists(email) {
    if (!await userService.existsByEmail(email))
        throw new EmailAlreadyExists(email)
}

async function checkEmailNotExists(email) {
    if (await userService.existsByEmail(email))
        throw new EmailAlreadyExists(email)
}

class AuthorizationController extends AbstractController {
    async register(req, res) {
        AbstractController.checkFields(req, 'request', ['body'])
        const { body } = req
        AbstractController.checkFields(body, 'body', ['user', 'fingerprint'])
        const { user, fingerprint } = body
        AbstractController.checkFields(user, 'user', ['email', 'psw'])
        const { email } = user
        await checkEmailNotExists(email)
        const createdUser = await userService.create(user)
        console.log(createdUser)
        const refresh = await sessionService.create(createdUser, fingerprint)
        const jwt = await jwtProvider.create(createdUser)
        refreshProvider.attach(refresh, res)
        res.status(201).send(_.omit(createdUser, 'psw'))
    }

    async login(user, fingerprint) {
        user = await userService.check(user)
        await sessionService.clean.fingerprint(user, fingerprint)
        const refresh = await sessionService.create(user, fingerprint)
        await sessionService.clean.overflow(user)
        return { user, refresh }
    }

    async refresh(refresh, fingerprint) {
        if (! await sessionService.existsActive(refresh, fingerprint)) {
            await sessionService.clean.outdated()
            await sessionService.remove(refresh, fingerprint)
            throw new NoActiveSessions()
        }
        return sessionService.update(refresh)
    }

    async logout(refresh) {
        await sessionService.remove(refresh)
    }
}


module.exports = new AuthorizationController()
