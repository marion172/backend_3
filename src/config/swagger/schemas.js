import { USER_ROLES, PRODUCT_STATUS, ORDER_STATUS, PRIORITY_ORDERS } from "../../constants/index.js";

const schemas = {
  Health: {
    type: 'object',
    properties: {
      service: { type: 'string', example: 'ShipNow API' },
      environment: { type: 'string', example: 'development' }
    }
  },

  User: {
    type: 'object',
    description: 'Password never returned in responses',
    properties: {
      _id: { type: 'string', example: '64a1f2e5c3b4d5e6f7g8h9i0' },
      first_name: { type: 'string', example: 'Juan' },
      last_name: { type: 'string', example: 'Perez' },
      email: { type: 'string', format: 'email', example: 'juan.perez@example.com' },
      role: { type: 'string', enum: Object.values(USER_ROLES), example: 'customer' },
    },
  },

  UserCreateRequest: {
    type: 'object',
    required: ['first_name', 'last_name', 'email', 'password'],
    properties: {
      first_name: { type: 'string', example: 'Juan' },
      last_name: { type: 'string', example: 'Perez' },
      email: { type: 'string', format: 'email', example: 'juan.perez@example.com' },
      password: { type: 'string', format: 'password', example: 'P@ssw0rd123' },
      role: { type: 'string', enum: Object.values(USER_ROLES), example: 'customer' },
    },
  },

  Product: {
    type: 'object',
    properties: {
      _id: { type: 'string', example: '64a1f2e5c3b4d5e6f7g8h9i1' },
      name: { type: 'string', example: 'Laptop Pro 15' },
      description: { type: 'string', example: 'Laptop de alta gama' },
      price: { type: 'number', example: 1200.50 },
      stock: { type: 'number', example: 25 },
      status: { type: 'string', enum: Object.values(PRODUCT_STATUS), example: 'AVAILABLE' },
    },
  },

  ProductCreateRequest: {
    type: 'object',
    required: ['name', 'price', 'stock'],
    properties: {
      name: { type: 'string', example: 'Laptop Pro 15' },
      description: { type: 'string', example: 'Laptop de alta gama' },
      price: { type: 'number', example: 1200.50 },
      stock: { type: 'number', example: 25 },
      status: { type: 'string', enum: Object.values(PRODUCT_STATUS), example: 'AVAILABLE' },
    },
  },

  OrderItem: {
    type: 'object',
    required: ['product', 'price', 'quantity', 'subTotal'],
    properties: {
      product: { type: 'string', example: 'Laptop Pro 15' },
      price: { type: 'number', example: 1200.50 },
      quantity: { type: 'number', example: 2 },
      subTotal: { type: 'number', example: 2401.00 },
    },
  },

  Order: {
    type: 'object',
    properties: {
      _id: { type: 'string', example: '64a1f2e5c3b4d5e6f7g8h9i2' },
      customerId: { type: 'string', example: '64a1f2e5c3b4d5e6f7g8h9i0' },
      items: {
        type: 'array',
        items: { $ref: '#/components/schemas/OrderItem' },
      },
      deliveryAddress: { type: 'string', example: 'Av. Corrientes 1234, CABA' },
      status: { type: 'string', enum: Object.values(ORDER_STATUS), example: 'CREATED' },
      priority: { type: 'string', enum: Object.values(PRIORITY_ORDERS), example: 'NORMAL' },
      total: { type: 'number', example: 2401.00 },
    },
  },

  OrderCreateRequest: {
    type: 'object',
    required: ['customerId', 'items', 'deliveryAddress', 'total'],
    properties: {
      customerId: { type: 'string', example: '64a1f2e5c3b4d5e6f7g8h9i0' },
      items: {
        type: 'array',
        items: { $ref: '#/components/schemas/OrderItem' },
      },
      deliveryAddress: { type: 'string', example: 'Av. Corrientes 1234, CABA' },
      priority: { type: 'string', enum: Object.values(PRIORITY_ORDERS), example: 'NORMAL' },
      total: { type: 'number', example: 2401.00 },
    },
  },

  Delivery: {
    type: 'object',
    properties: {
      _id: { type: 'string', example: '64a1f2e5c3b4d5e6f7g8h9i3' },
      orderId: { type: 'string', example: '64a1f2e5c3b4d5e6f7g8h9i2' },
      driverId: { type: 'string', example: '64a1f2e5c3b4d5e6f7g8h9i4', nullable: true },
      status: { type: 'string', enum: Object.values(ORDER_STATUS), example: 'CREATED' },
    },
  },

  DeliveryCreateRequest: {
    type: 'object',
    required: ['orderId'],
    properties: {
      orderId: { type: 'string', example: '64a1f2e5c3b4d5e6f7g8h9i2' },
      driverId: { type: 'string', example: '64a1f2e5c3b4d5e6f7g8h9i4' },
      status: { type: 'string', enum: Object.values(ORDER_STATUS), example: 'CREATED' },
    },
  },

  MockDataPayload: {
    type: 'object',
    properties: {
      quantity: { type: 'number', example: 10, description: 'Number of elements to generate' },
    },
  },

  MockResult: {
    type: 'object',
    properties: {
      message: { type: 'string', example: 'Data generated successfully' },
      count: { type: 'number', example: 10 },
    },
  },

  SuccessResponse: {
    type: 'object',
    properties: {
      status: { type: 'string', example: 'success' },
      message: { type: 'string', example: 'Operation successfully completed' },
    },
  },

  ErrorResponse: {
    type: 'object',
    properties: {
      status: { type: 'string', example: 'error' },
      error: { type: 'string', example: 'USER_ALREADY_EXISTS' },
      message: { type: 'string', example: 'User already exists' },
    },
  },
};

export default schemas;
