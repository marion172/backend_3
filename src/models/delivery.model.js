import mongoose from 'mongoose';
import { ORDER_STATUS } from '../constants/index.js';

const deliverySchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  status: { type: String, default: ORDER_STATUS.CREATED, enum: Object.values(ORDER_STATUS) },
});

const DeliveryModel = mongoose.model('Delivery', deliverySchema);

export default DeliveryModel;
