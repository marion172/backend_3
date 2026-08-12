import UserRepository from '../repositories/user.repository.js';
import CustomError from '../errors/custom.error.js';
import logger from '../config/logger.js';

class UserService {
  static async getAll() {
    return await UserRepository.find();
  }

  static async getById(id) {
    const user = await UserRepository.findById(id);
    if (!user) {
      logger.warning(`User #${id} not found`);
      throw new CustomError('USER_NOT_FOUND');
    }
    return user;
  }

  static async create(userData) {
    const { email } = userData;

    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      logger.warning(`The user with email ${email} already exists`);
      throw new CustomError('USER_ALREADY_EXISTS');
    }

    const newUser = await UserRepository.create(userData);
    logger.info(`User #${newUser._id} created successfully`);
    return newUser;
  }

  static async update(id, userData) {
    const updatedUser = await UserRepository.findById(id);

    if (!updatedUser) {
      logger.warning(`User #${id} not found for update`);
      throw new CustomError('USER_NOT_FOUND');
    }

    return await UserRepository.update(id, userData);
  }

  static async delete(id) {
    const deletedUser = await UserRepository.findById(id);
    if (!deletedUser) {
      logger.warning(`User #${id} not found for delete`);
      throw new CustomError('USER_NOT_FOUND');
    }
    return await UserRepository.delete(id);
  }
}

export default UserService;
