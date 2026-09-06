import mongoose from 'mongoose';
import { ORDER_STATUS } from '../constants/index.js';
import documentSchema from './document.schema.js';

const deliverySchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  status: { type: String, default: ORDER_STATUS.CREATED, enum: Object.values(ORDER_STATUS) },
  receipts: { type: [documentSchema], default: [] },
});


const DeliveryModel = mongoose.model('Delivery', deliverySchema);

export default DeliveryModel;
