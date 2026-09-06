import mongoose from 'mongoose';

export const documentSchema = new mongoose.Schema({
  originalName: { type: String, required: true },
  filename: { type: String, required: true },
  path: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true },
  documentType: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
}, { _id: true });

export default documentSchema;
