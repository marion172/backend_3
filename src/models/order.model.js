import mongoose from 'mongoose';
import { ORDER_STATUS, PRIORITY_ORDERS } from '../constants/index.js';

const itemSchema = new mongoose.Schema({
  product: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 },
  subTotal: { type: Number, required: true, min: 0 },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [itemSchema],
  deliveryAddress: { type: String, required: true },
  status: { type: String, default: ORDER_STATUS.CREATED, enum: Object.values(ORDER_STATUS) },
  priority: { type: String, default: PRIORITY_ORDERS.NORMAL, enum: Object.values(PRIORITY_ORDERS) },
  total: { type: Number, required: true, min: 0 },
});

const OrderModel = mongoose.model('Order', orderSchema);

export default OrderModel;
