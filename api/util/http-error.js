class HttpError extends Error {
    constructor(code, name, msg) {
        super(msg);
        this.code = code
        this.name = name
    }
}

module.exports = {
    NotFound: class extends HttpError {
        constructor(stuff) {
            super(404, 'NOT_FOUND', `${ stuff } not found`);
        }
    },
    EmailAlreadyExists: class extends HttpError {
        constructor(email) {
            super(409, 'EMAIL_EXIST', `${ email } already exists`);
        }
    },
    EmailNotExists: class extends HttpError {
        constructor(email) {
            super(401, 'EMAIL_NOT_EXIST', `${ email } not found`);
        }
    },
    WrongPsw: class extends HttpError {
        constructor(psw) {
            super(401, 'WRONG_PSW', `${ psw } is wrong`);
        }
    },
    SessionError: class extends HttpError {
        constructor(msg) {
            super(401, 'SESSION_ERROR', msg);
        }
    },
    JwtError: class extends HttpError {
        constructor(msg) {
            super(401, 'JWT_ERROR', msg);
        }
    },
    HttpError,
}
