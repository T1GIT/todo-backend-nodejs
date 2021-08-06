class HttpError extends Error {
    constructor(code, message) {
        super(message);
        this.code = code
    }
}

class NotFound extends HttpError {
    constructor(stuff) {
        super(404, `${stuff} not found`);
    }
}

class EmailAlreadyExists extends HttpError {
    constructor(email) {
        super(409, `${ email } already exists`);
    }
}

class EmailNotExists extends HttpError {
    constructor(email) {
        super(401, `${ email } not found`);
    }
}

class WrongPsw extends HttpError {
    constructor(psw) {
        super(`${psw} is wrong`);
    }
}

class InvalidEmail extends HttpError {
    constructor(email) {
        super(`${email} is invalid`);
    }
}

class InvalidPsw extends HttpError {
    constructor(psw) {
        super(`${psw} is invalid`);
    }
}

class NoActiveSessions extends HttpError {
    constructor() {
        super("can not find given session");
    }
}

class JwtError extends HttpError {
    constructor(msg) {
        super(401, msg);
    }
}

module.exports = {
    HttpError, NotFound, EmailNotExists, EmailAlreadyExists, WrongPsw,
    InvalidEmail, InvalidPsw, NoActiveSessions, JwtError
}
