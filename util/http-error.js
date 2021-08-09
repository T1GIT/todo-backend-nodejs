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
    InvalidEmail: class extends HttpError {
        constructor(email) {
            super(422, `${ email } is invalid`);
        }
    },
    InvalidPsw: class extends HttpError {
        constructor(psw) {
            super(422, `${ psw } is invalid`);
        }
    },
    WrongPsw: class extends HttpError {
        constructor(psw) {
            super(401, `${ psw } is wrong`);
        }
    },
    NoActiveSessions: class extends HttpError {
        constructor() {
            super(401, "can not find given session");
        }
    },
    JwtError: class extends HttpError {
        constructor(msg) {
            super(401, msg);
        }
    },
    BadRequest: class extends HttpError {
        constructor(msg) {
            super(400, msg);
        }
    },
    HttpError,
}
