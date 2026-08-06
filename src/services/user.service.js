import UserRepository from '../repositories/user.repository.js';
import CustomError from '../errors/custom.error.js';

class UserService {
  static async getAll() {
    return await UserRepository.find();
  }

  static async getById(id) {
    const user = await UserRepository.findById(id);
    if (!user) {
      throw new CustomError('USER_NOT_FOUND');
    }
    return user;
  }

  static async create(userData) {
    const { email } = userData;

    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      throw new CustomError('USER_ALREADY_EXISTS');
    }

    return await UserRepository.create(userData);
  }

  static async update(id, userData) {
    const updatedUser = await UserRepository.findById(id);

    if (!updatedUser) {
      throw new CustomError('USER_NOT_FOUND');
    }

    return await UserRepository.update(id, userData);
  }

  static async delete(id) {
    const deletedUser = await UserRepository.findById(id);
    if (!deletedUser) {
      throw new CustomError('USER_NOT_FOUND');
    }
    return await UserRepository.delete(id);
  }
}

export default UserService;
