const responses = {
  HealthResponse: {
    description: 'Service health status response',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/Health',
        },
      },
    },
  },

  UsersListResponse: {
    description: 'Get users lists',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: {
            $ref: '#/components/schemas/User',
          },
        },
      },
    },
  },

  UserCreatedResponse: {
    description: 'User successfully created',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/User',
        },
      },
    },
  },

  UserResponse: {
    description: 'User details',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/User',
        },
      },
    },
  },

  ProductsListResponse: {
    description: 'Get product lists',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: {
            $ref: '#/components/schemas/Product',
          },
        },
      },
    },
  },

  ProductCreatedResponse: {
    description: 'Product successfully created',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/Product',
        },
      },
    },
  },

  ProductResponse: {
    description: 'Product detail',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/Product',
        },
      },
    },
  },

  OrdersListResponse: {
    description: 'Get order lists',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: {
            $ref: '#/components/schemas/Order',
          },
        },
      },
    },
  },

  OrderCreatedResponse: {
    description: 'Order successfully created',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/Order',
        },
      },
    },
  },

  OrderDetailResponse: {
    description: 'Order detail',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/Order',
        },
      },
    },
  },

  DeliveriesListResponse: {
    description: 'Get delivery lists',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: {
            $ref: '#/components/schemas/Delivery',
          },
        },
      },
    },
  },

  DeliveryCreatedResponse: {
    description: 'Delivery successfully created',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/Delivery',
        },
      },
    },
  },

  DeliveryResponse: {
    description: 'Deliver detail',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/Delivery',
        },
      },
    },
  },

  BadRequestResponse: {
    description: 'Bad request or invalid data',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/ErrorResponse',
        },
        example: {
          status: 'error',
          error: 'VALIDATION_ERROR',
          message: 'Missing required fields',
        },
      },
    },
  },

  NotFoundResponse: {
    description: 'Resource not found',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/ErrorResponse',
        },
        example: {
          status: 'error',
          error: 'USER_NOT_FOUND',
          message: 'User not found',
        },
      },
    },
  },

  ConflictResponse: {
    description: 'Resource conflict or duplicate',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/ErrorResponse',
        },
        example: {
          status: 'error',
          error: 'USER_ALREADY_EXISTS',
          message: 'User already exists',
        },
      },
    },
  },
};

export default responses;
