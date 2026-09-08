import UserModel from '../models/user.model.js';

class UserRepository {
  static async find(queryParams = {}) {
    const { page = 1, limit = 50, role, email, search } = queryParams;
    const parsedPage = Math.max(1, parseInt(page) || 1);
    const parsedLimit = Math.min(100, Math.max(1, parseInt(limit) || 50));
    const skip = (parsedPage - 1) * parsedLimit;

    const filter = {};
    if (role) filter.role = role;
    if (email) filter.email = email;
    if (search) {
      filter.$or = [
        { first_name: { $regex: search, $options: 'i' } },
        { last_name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    return await UserModel.find(filter).skip(skip).limit(parsedLimit);
  }

  static async findById(id) {
    return await UserModel.findById(id);
  }

  static async findByEmail(email) {
    return await UserModel.findOne({ email });
  }

  static async create(userData) {
    const user = new UserModel(userData);
    return await user.save();
  }

  static async update(id, userData) {
    const { first_name, last_name, email, password } = userData;
    return await UserModel.findByIdAndUpdate(id, { first_name, last_name, email, password }, { returnDocument: 'after', runValidators: true });
  }

  static async delete(id) {
    return await UserModel.findByIdAndDelete(id);
  }

  static async insertMany(usersData) {
    return await UserModel.insertMany(usersData);
  }

  static async addDocument(id, documentData) {
    return await UserModel.findByIdAndUpdate(
      id,
      { $push: { documents: documentData } },
      { returnDocument: 'after', runValidators: true }
    );
  }
}


export default UserRepository;
