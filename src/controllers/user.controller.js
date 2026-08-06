import UserService from '../services/user.service.js';
import CustomError from '../errors/custom.error.js';

class UserController {
  static async getAll(req, res, next) {
    try {
      const users = await UserService.getAll();
      res.status(200).json(users);
    } catch (error) {
      next(error)
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await UserService.getById(id);
      res.status(200).json(user);
    } catch (error) {
      next(error)
    }
  }

  static async create(req, res, next) {
    try {
      const { first_name, last_name, email, password } = req.body;
      if (!first_name || !last_name || !email || !password) {
        throw new CustomError('VALIDATION_ERROR', 'Missing required fields');
      }
      const user = await UserService.create(req.body);
      res.status(201).json(user);
    } catch (error) {
      next(error)
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { first_name, last_name, email, password } = req.body;
      if (!first_name || !last_name || !email || !password) {
        throw new CustomError('VALIDATION_ERROR', 'Missing required fields');
      }
      const user = await UserService.update(id, req.body);
      res.status(200).json(user);
    } catch (error) {
      next(error)
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      if (!id) {
        throw new CustomError('VALIDATION_ERROR', 'Missing required fields');
      }
      const user = await UserService.delete(id);
      res.status(200).json(user);
    } catch (error) {
      next(error)
    }
  }
}

export default UserController;