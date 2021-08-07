class HttpError extends Error {
    constructor(code, message) {
        super(message);
        this.code = code
    }
}

module.exports = {
    NotFound: class extends HttpError {
        constructor(stuff) {
            super(404, `${ stuff } not found`);
        }
    },
    EmailAlreadyExists: class extends HttpError {
        constructor(email) {
            super(409, `${ email } already exists`);
        }
    },
    EmailNotExists: class extends HttpError {
        constructor(email) {
            super(401, `${ email } not found`);
        }
    },
    WrongPsw: class extends HttpError {
        constructor(psw) {
            super(`${ psw } is wrong`);
        }
    },
    NoActiveSessions: class extends HttpError {
        constructor() {
            super("can not find given session");
        }
    },
    JwtError: class extends HttpError {
        constructor(msg) {
            super(401, msg);
        }
    },
    HttpError,
}
