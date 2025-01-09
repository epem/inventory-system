export class ApplicationError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class ValidationError extends ApplicationError {
    constructor(message) {
        super(message, 400);
    }
}

export class NotFoundError extends ApplicationError {
    constructor(resource) {
        super(`${resource} not found`, 404);
    }
}

export class InsufficientStockError extends ApplicationError {
    constructor() {
        super('Insufficient stock for the requested operation', 400);
    }
}

