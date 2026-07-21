import UserRepository from '../repositories/user.repository.js';

class UserService {
  static async getAll(filters = {}) {
    return await UserRepository.find(filters);
  }

  static async getById(id) {
    const user = await UserRepository.findById(id);
    if (!user) {
      throw new Error(`El usuario con ID ${id} no existe`);
    }
    return user;
  }

  static async create(userData) {
    const { email } = userData;

    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      throw new Error(`El usuario con email '${email}' ya existe`);
    }

    return await UserRepository.create(userData);
  }

  static async update(id, userData) {
    const existingUser = await UserRepository.findById(id);
    if (!existingUser) {
      throw new Error(`El usuario con ID ${id} no existe`);
    }

    if (userData.email && userData.email !== existingUser.email) {
      const duplicate = await UserRepository.findByEmail(userData.email);
      if (duplicate) {
        throw new Error(`El usuario con email '${userData.email}' ya existe`);
      }
    }

    return await UserRepository.update(id, userData);
  }

  static async delete(id) {
    const existingUser = await UserRepository.findById(id);
    if (!existingUser) {
      throw new Error(`El usuario con ID ${id} no existe`);
    }
    return await UserRepository.delete(id);
  }
}

export default UserService;
