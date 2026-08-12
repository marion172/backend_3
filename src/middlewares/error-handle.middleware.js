import logger from "../config/logger.js";
import CustomError from "../errors/custom.error.js";

export function errorHandler(err, req, res, next) {
    const isCustomError = err instanceof CustomError;
    const customError = isCustomError ? err : mapToCustomError(err);

    const { statusCode, code, message } = customError;

    if (statusCode >= 500) {
        logger.error(`[Error ${statusCode}]: ${message} - ${err.stack || JSON.stringify(customError)}`);
    } else {
        logger.warning(`[Warning ${statusCode}]: ${message} - ${JSON.stringify(customError)}`);
    }

    res.status(statusCode).json({ status: 'error', error: code, message });
}

export function notFoundHandler(req, res, next) {
    logger.warning(`Route not found: ${req.method} ${req.originalUrl}`);
    next(new CustomError('ROUTE_NOT_FOUND'));
}

function mapToCustomError(err) {
    if (err.name === 'CastError') {
        return new CustomError('INVALID_ID');
    }
    if (err.code === 11000) {
        return new CustomError('DUPLICATE_KEY');
    }
    if (err.name === 'ValidationError') {
        return new CustomError('VALIDATION_ERROR');
    }

    return new CustomError('INTERNAL_SERVER_ERROR');
}