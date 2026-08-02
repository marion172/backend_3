import mongoose from 'mongoose';

import { USER_ROLES } from '../constants/index.js';

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  role: { type: String, default: USER_ROLES.CUSTOMER, enum: Object.values(USER_ROLES) },
});

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
