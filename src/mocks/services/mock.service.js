import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';

import UserRepository from '../../repositories/user.repository.js';
import ProductRepository from '../../repositories/product.repository.js';
import OrderRepository from '../../repositories/order.repository.js';
import DeliveryRepository from '../../repositories/delivery.repository.js';
import CustomError from '../../errors/custom.error.js';
import logger from '../../config/logger.js';

import { USER_ROLES, ORDER_STATUS, PRIORITY_ORDERS, PRODUCT_STATUS } from '../../constants/index.js';

class MockService {
  static validateMockQuantity = (count, min = 1, max = 100) => {
    const num = Number(count);
    if (count === undefined || count === null || isNaN(num) || !Number.isInteger(num) || num < min || num > max) {
      logger.warning(`Cantidad inválida de mocks: ${count}`);
      throw new CustomError('INVALID_MOCK_QUANTITY');
    }
    return num;
  };

  static generateMockUsers = (count = 10) => {
    const validCount = this.validateMockQuantity(count);
    const roles = Object.values(USER_ROLES);
    const users = Array.from({ length: validCount }, () => {
      return {
        _id: new mongoose.Types.ObjectId().toString(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: faker.helpers.arrayElement(roles),
      };
    });

    return users;
  };

  static generateMockProducts = (count = 10) => {
    const validCount = this.validateMockQuantity(count);
    const products = Array.from({ length: validCount }, () => {
      const productName = faker.commerce.productName();
      return {
        _id: new mongoose.Types.ObjectId().toString(),
        name: productName,
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price()),
        stock: faker.number.int({ min: 0, max: 100 }),
        status: faker.helpers.arrayElement(Object.values(PRODUCT_STATUS)),
      };
    });

    return products;
  };

  static generateMockOrders = (count = 10, customers = []) => {
    const validCount = this.validateMockQuantity(count);
    const estado = Object.values(ORDER_STATUS);
    const priority = Object.values(PRIORITY_ORDERS);

    const customerUsers = customers.filter((u) => u.role === USER_ROLES.CUSTOMER);

    const orders = Array.from({ length: validCount }, () => {
      let total = 0;

      const items = Array.from({ length: 5 }, () => {
        const price = parseFloat(faker.commerce.price({ min: 10, max: 500 }));
        const quantity = faker.number.int({ min: 1, max: 5 });
        const subTotal = parseFloat((price * quantity).toFixed(2));

        total += subTotal;

        return {
          product: faker.commerce.productName(),
          price,
          quantity,
          subTotal,
        };
      });

      total = parseFloat(total.toFixed(2));
      const customer = customerUsers.length > 0 ? faker.helpers.arrayElement(customerUsers) : null;

      return {
        _id: new mongoose.Types.ObjectId().toString(),
        customerId: customer ? customer._id : new mongoose.Types.ObjectId().toString(),
        items,
        deliveryAddress: `${faker.location.streetAddress()}, ${faker.location.city()}`,
        status: faker.helpers.arrayElement(estado),
        priority: faker.helpers.arrayElement(priority),
        total,
      };
    });

    return orders;
  };

  static generateMockDeliveries = (orders = [], users = []) => {
    const estado = Object.values(ORDER_STATUS);
    const drivers = users.filter((u) => u.role === USER_ROLES.DRIVER);

    const deliveries = orders.map((order) => {
      const status = faker.helpers.arrayElement(estado);
      const needsDriver = status !== ORDER_STATUS.CREATED && status !== ORDER_STATUS.CANCELLED;
      const driver = (needsDriver && drivers.length > 0) ? faker.helpers.arrayElement(drivers) : null;

      return {
        _id: new mongoose.Types.ObjectId().toString(),
        orderId: order._id,
        driverId: driver ? driver._id : null,
        status,
      };
    });

    return deliveries;
  };

  static generateFullMockData = ({ userCount = 10, orderCount = 10 } = {}) => {
    const validUserCount = this.validateMockQuantity(userCount);
    const validOrderCount = this.validateMockQuantity(orderCount);

    const users = this.generateMockUsers(validUserCount);
    const orders = this.generateMockOrders(validOrderCount, users);
    const deliveries = this.generateMockDeliveries(orders, users);

    return {
      users,
      orders,
      deliveries,
    };
  };

  static seedUsers = async (qty = 10) => {
    const validQty = this.validateMockQuantity(qty);
    const mockUsers = this.generateMockUsers(validQty);
    const insertedUsers = await UserRepository.insertMany(mockUsers);

    return {
      insertados: insertedUsers.length,
      coleccion: 'usuarios',
    };
  };

  static saveMockProducts = async (products) => {
    if (!Array.isArray(products) || products.length === 0) {
      logger.warning(`Products array must not be empty`);
      throw new CustomError('VALIDATION_ERROR', 'Products array must not be empty');
    }
    await ProductRepository.insertMany(products);
  };

  static saveMockOrders = async (orders) => {
    if (!Array.isArray(orders) || orders.length === 0) {
      logger.warning(`Orders array must not be empty`);
      throw new CustomError('VALIDATION_ERROR', 'Orders array must not be empty');
    }
    await OrderRepository.insertMany(orders);
  };

  static saveMockDeliveries = async (deliveries) => {
    if (!Array.isArray(deliveries) || deliveries.length === 0) {
      logger.warning(`Deliveries array must not be empty`);
      throw new CustomError('VALIDATION_ERROR', 'Deliveries array must not be empty');
    }
    await DeliveryRepository.insertMany(deliveries);
  };

  static seedOrders = async (qty = 10) => {
    const validQty = this.validateMockQuantity(qty);
    let users = await UserRepository.find();
    let customers = users.filter((u) => u.role === USER_ROLES.CUSTOMER);

    if (customers.length === 0) {
      const mockUsers = this.generateMockUsers(5);
      users = await UserRepository.insertMany(mockUsers);
      customers = users.filter((u) => u.role === USER_ROLES.CUSTOMER);
    }

    const mockOrders = this.generateMockOrders(validQty, customers);
    const insertedOrders = await OrderRepository.insertMany(mockOrders);

    return {
      insertados: insertedOrders.length,
      coleccion: 'pedidos',
    };
  };

  static seedDeliveries = async (qty = 10) => {
    const validQty = this.validateMockQuantity(qty);
    let orders = await OrderRepository.find();

    if (orders.length === 0) {
      const seedOrdersResult = await this.seedOrders(validQty);
      orders = await OrderRepository.find();
    }

    let users = await UserRepository.find();
    let drivers = users.filter((u) => u.role === USER_ROLES.DRIVER);

    const mockDeliveries = this.generateMockDeliveries(orders.slice(0, validQty), users);
    const insertedDeliveries = await DeliveryRepository.insertMany(mockDeliveries);

    return {
      insertados: insertedDeliveries.length,
      coleccion: 'entregas',
    };
  };

  static seedFullData = async ({ userCount = 10, orderCount = 10 } = {}) => {
    const validUserCount = this.validateMockQuantity(userCount);
    const validOrderCount = this.validateMockQuantity(orderCount);

    const mockUsers = this.generateMockUsers(validUserCount);
    const insertedUsers = await UserRepository.insertMany(mockUsers);

    const mockOrders = this.generateMockOrders(validOrderCount, insertedUsers);
    const insertedOrders = await OrderRepository.insertMany(mockOrders);

    const mockDeliveries = this.generateMockDeliveries(insertedOrders, insertedUsers);
    const insertedDeliveries = await DeliveryRepository.insertMany(mockDeliveries);

    return {
      usuarios: insertedUsers.length,
      pedidos: insertedOrders.length,
      entregas: insertedDeliveries.length,
      coleccion: 'all_mock_data',
    };
  };
}

export default MockService;
