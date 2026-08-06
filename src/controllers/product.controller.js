import ProductService from '../services/product.service.js';
import CustomError from '../errors/custom.error.js';

class ProductController {
  static async getAll(req, res, next) {
    try {
      const products = await ProductService.getAllProducts(req.query);
      res.status(200).json(products);
    } catch (error) {
      next(error)
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const product = await ProductService.getProductById(id);
      res.status(200).json(product);
    } catch (error) {
      next(error)
    }
  }

  static async create(req, res, next) {
    try {
      const { name, description, price, stock } = req.body;
      if (!name || !description || price === undefined || stock === undefined) {
        throw new CustomError('VALIDATION_ERROR', 'Missing required fields');
      }
      const product = await ProductService.createProduct(req.body);
      res.status(201).json(product);
    } catch (error) {
      next(error)
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { name, description, price, stock } = req.body;
      if (!name || !description || !price || !stock) {
        throw new CustomError('VALIDATION_ERROR', 'Missing required fields');
      }
      const product = await ProductService.updateProduct(id, req.body);
      res.status(200).json(product);
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
      const product = await ProductService.deleteProduct(id);
      res.status(200).json(product);
    } catch (error) {
      next(error)
    }
  }
}

export default ProductController;
