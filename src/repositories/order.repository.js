import OrderModel from '../models/order.model.js';

class OrderRepository {
  static async find() {
    return await OrderModel.find();
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
}

export default OrderRepository;
