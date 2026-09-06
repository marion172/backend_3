import UserModel from '../models/user.model.js';

class UserRepository {
  static async find() {
    return await UserModel.find();
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
