import UserService from '../services/user.service.js';

class UserController {
  static async getAll(req, res) {
    try {
      const users = await UserService.getAll(req.query);
      res.status(200).json(users);
    } catch (error) {
      console.warn('Error getting users');
      res.status(500).json({ statusCode: 500, message: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const user = await UserService.getById(id);
      res.status(200).json(user);
    } catch (error) {
      console.warn('Error getting user by id');
      res.status(500).json({ statusCode: 500, message: error.message });
    }
  }

  static async create(req, res) {
    try {
      const user = await UserService.create(req.body);
      res.status(201).json(user);
    } catch (error) {
      console.warn('Error creating user');
      res.status(500).json({ statusCode: 500, message: error.message });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const user = await UserService.update(id, req.body);
      res.status(200).json(user);
    } catch (error) {
      console.warn('Error updating user');
      res.status(500).json({ statusCode: 500, message: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      await UserService.delete(id);
      res.status(200).json({ statusCode: 200, message: 'User successfully deleted' });
    } catch (error) {
      console.warn('Error deleting user');
      res.status(500).json({ statusCode: 500, message: error.message });
    }
  }
}

export default UserController;