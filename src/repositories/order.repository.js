import OrderModel from '../models/order.model.js';

class OrderRepository {
  static async find(queryParams = {}) {
    const { page = 1, limit = 50, status, priority, customerId } = queryParams;
    const parsedPage = Math.max(1, parseInt(page) || 1);
    const parsedLimit = Math.min(100, Math.max(1, parseInt(limit) || 50));
    const skip = (parsedPage - 1) * parsedLimit;

    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (customerId) filter.customerId = customerId;

    return await OrderModel.find(filter).skip(skip).limit(parsedLimit);
  }

  static async findById(id) {
    return await OrderModel.findById(id);
  }

  static async create(orderData) {
    const order = new OrderModel(orderData);
    return await order.save();
  }

  static async update(id, orderData) {
    return await OrderModel.findByIdAndUpdate(id, orderData, { returnDocument: 'after', runValidators: true });
  }

  static async delete(id) {
    return await OrderModel.findByIdAndDelete(id);
  }

  static async insertMany(ordersData) {
    return await OrderModel.insertMany(ordersData);
  }

  static async addReceipt(id, receiptData) {
    return await OrderModel.findByIdAndUpdate(
      id,
      { $push: { receipts: receiptData } },
      { returnDocument: 'after', runValidators: true }
    );
  }
}

export default OrderRepository;
