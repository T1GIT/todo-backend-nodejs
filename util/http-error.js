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
            super(404, 'NotFound', `${ stuff } not found`);
        }
    },
    EmailAlreadyExists: class extends HttpError {
        constructor(email) {
            super(409, 'EmailAlreadyExists', `${ email } already exists`);
        }
    },
    EmailNotExists: class extends HttpError {
        constructor(email) {
            super(401, 'EmailNotExists', `${ email } not found`);
        }
    },
    WrongPsw: class extends HttpError {
        constructor(psw) {
            super(401, 'WrongPsw', `${ psw } is wrong`);
        }
    },
    SessionError: class extends HttpError {
        constructor(msg) {
            super(401, 'SessionError', msg);
        }
    },
    HttpError,
}
