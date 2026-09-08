import DeliveryModel from '../models/delivery.model.js';

class DeliveryRepository {
  static async find(queryParams = {}) {
    const { page = 1, limit = 50, status, trackingCode, orderId } = queryParams;
    const parsedPage = Math.max(1, parseInt(page) || 1);
    const parsedLimit = Math.min(100, Math.max(1, parseInt(limit) || 50));
    const skip = (parsedPage - 1) * parsedLimit;

    const filter = {};
    if (status) filter.status = status;
    if (trackingCode) filter.trackingCode = trackingCode;
    if (orderId) filter.orderId = orderId;

    return await DeliveryModel.find(filter).skip(skip).limit(parsedLimit);
  }

  static async findById(id) {
    return await DeliveryModel.findById(id);
  }

  static async create(deliveryData) {
    const delivery = new DeliveryModel(deliveryData);
    return await delivery.save();
  }

  static async update(id, deliveryData) {
    return await DeliveryModel.findByIdAndUpdate(id, deliveryData, { returnDocument: 'after', runValidators: true });
  }

  static async delete(id) {
    return await DeliveryModel.findByIdAndDelete(id);
  }

  static async insertMany(deliveriesData) {
    return await DeliveryModel.insertMany(deliveriesData);
  }

  static async addReceipt(id, receiptData) {
    return await DeliveryModel.findByIdAndUpdate(
      id,
      { $push: { receipts: receiptData } },
      { returnDocument: 'after', runValidators: true }
    );
  }
}


export default DeliveryRepository;
