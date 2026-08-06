export const ERROR_CODES = Object.freeze({
    USER_NOT_FOUND: {
        statusCode: 404,
        message: 'User not found',
    },
    USER_ALREADY_EXISTS: {
        statusCode: 409,
        message: 'User already exists',
    },
    INVALID_ID: {
        statusCode: 400,
        message: 'Invalid id',
    },
    DUPLICATE_KEY: {
        statusCode: 409,
        message: 'Email already in use',
    },
    VALIDATION_ERROR: {
        statusCode: 400,
        message: 'Validation error',
    },
    ROUTE_NOT_FOUND: {
        statusCode: 404,
        message: 'Route not found',
    },
    INTERNAL_SERVER_ERROR: {
        statusCode: 500,
        message: 'Internal Server Error',
    },
    PRODUCT_NOT_FOUND: {
        statusCode: 404,
        message: 'Product not found',
    },
    PRODUCT_ALREADY_EXISTS: {
        statusCode: 409,
        message: 'Product already exists',
    },
    PRODUCT_VALIDATION_ERROR: {
        statusCode: 400,
        message: 'Product validation error',
    },
    PRODUCT_QUANTITY_ERROR: {
        statusCode: 400,
        message: 'Product quantity error cant be negative',
    },
    PRODUCT_PRICE_ERROR: {
        statusCode: 400,
        message: 'Product price error price must be grater than 0',
    },
    ORDER_NOT_FOUND: {
        statusCode: 404,
        message: 'Order not found',
    },
    DELIVERY_NOT_FOUND: {
        statusCode: 404,
        message: 'Delivery not found',
    },
    INVALID_STATE: {
        statusCode: 400,
        message: 'Invalid state',
    },
    INVALID_MOCK_QUANTITY: {
        statusCode: 400,
        message: 'Invalid mock quantity. Must be between 1 and 100.',
    },
})