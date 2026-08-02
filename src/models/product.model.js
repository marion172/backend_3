import mongoose from 'mongoose';
import { PRODUCT_STATUS } from '../constants/index.js';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String, trim: true },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0 },
  status: { type: String, default: PRODUCT_STATUS.AVAILABLE, enum: Object.values(PRODUCT_STATUS) }
});

const ProductModel = mongoose.model('Product', productSchema);

export default ProductModel;
