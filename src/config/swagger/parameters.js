const parameters = {
    UserIdParam: {
        name: 'id',
        in: 'path',
        required: true,
        description: 'Unique user ID in MongoDB',
        schema: {
            type: 'string',
            example: '6a6fa565d5f30e3afa5be726',
        },
    },

    ProductIdParam: {
        name: 'id',
        in: 'path',
        required: true,
        description: 'Unique product ID in MongoDB',
        schema: {
            type: 'string',
            example: '6a6fa565d5f30e3afa5be727',
        },
    },

    OrderIdParam: {
        name: 'id',
        in: 'path',
        required: true,
        description: 'Unique order ID in MongoDB',
        schema: {
            type: 'string',
            example: '6a6fa565d5f30e3afa5be728',
        },
    },

    DeliveryIdParam: {
        name: 'id',
        in: 'path',
        required: true,
        description: 'Unique delivery ID in MongoDB',
        schema: {
            type: 'string',
            example: '6a6fa565d5f30e3afa5be729',
        },
    },
};

export default parameters;
