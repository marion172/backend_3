export const USER_ROLES = Object.freeze({
    ADMIN: 'admin',
    CUSTOMER: 'customer',
    DRIVER: 'driver',
    STORE: 'store'
});

export const PRODUCT_STATUS = Object.freeze({
    AVAILABLE: 'AVAILABLE',
    OUT_OF_STOCK: 'OUT_OF_STOCK',
});

export const ORDER_STATUS = Object.freeze({
    CREATED: 'CREATED',
    ASSIGNED: 'ASSIGNED',
    PICKED_UP: 'PICKED_UP',
    IN_TRANSIT: 'IN_TRANSIT',
    DELIVERED: 'DELIVERED',
    CANCELLED: 'CANCELLED',
});

export const PRIORITY_ORDERS = Object.freeze({
    URGENT: 'URGENT',
    NORMAL: 'NORMAL',
    LOW: 'LOW',
});