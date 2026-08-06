import { ERROR_CODES } from "./error-codes.js";

class CustomError extends Error {
    constructor(code, message) {
        const errorDefinition = ERROR_CODES[code] ?? ERROR_CODES.INTERNAL_SERVER_ERROR;
        const resolvedCode = ERROR_CODES[code] ? code : 'INTERNAL_SERVER_ERROR';

        super(message ?? errorDefinition.message);

        this.statusCode = errorDefinition.statusCode;
        this.code = resolvedCode;
        this.message = message ?? errorDefinition.message;
        Error.captureStackTrace(this, this.constructor);
    }
}

export default CustomError;