import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';

import UserRepository from '../../repositories/user.repository.js';
import ProductRepository from '../../repositories/product.repository.js';

import { USER_ROLES, ORDER_STATUS, PRIORITY_ORDERS, PRODUCT_STATUS } from '../../constants/index.js';

class MockService {
  static generateMockUsers = (count) => {
    const roles = Object.values(USER_ROLES);
    const users = Array.from({ length: count }, () => {
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

  static generateMockProducts = (count) => {
    const products = Array.from({ length: count }, () => {
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

  static generateMockOrders = (count, customers = []) => {
    const estado = Object.values(ORDER_STATUS);
    const priority = Object.values(PRIORITY_ORDERS);

    const customerUsers = customers.filter((u) => u.role === USER_ROLES.CUSTOMER);

    const orders = Array.from({ length: count }, () => {
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

  static generateFullMockData = ({ userCount, orderCount } = {}) => {
    const users = this.generateMockUsers(userCount);
    const orders = this.generateMockOrders(orderCount, users);
    const deliveries = this.generateMockDeliveries(orders, users);

    return {
      users,
      orders,
      deliveries,
    };
  };

  static seedUsers = async (qty = 10) => {
    const mockUsers = this.generateMockUsers(qty);
    const insertedUsers = await UserRepository.insertMany(mockUsers);

    return {
      insertados: insertedUsers.length,
      coleccion: 'usuarios',
    };
  };

  static saveMockProducts = async (products) => {
    await ProductRepository.insertMany(products);
  };
}

export default MockService;
