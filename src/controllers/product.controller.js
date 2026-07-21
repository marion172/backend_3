import ProductService from '../services/product.service.js';

class ProductController {
  static async getAll(req, res) {
    try {
      const products = await ProductService.getAllProducts(req.query);
      res.status(200).json(products);
    } catch (error) {
      console.error('Error getting product:', error.message);
      res.status(500).json({ statusCode: 500, message: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const product = await ProductService.getProductById(id);
      res.status(200).json(product);
    } catch (error) {
      console.error('Error getting product by id:', error.message);
      res.status(500).json({ statusCode: 500, message: error.message });
    }
  }

  static async create(req, res) {
    try {
      const product = await ProductService.createProduct(req.body);
      res.status(201).json(product);
    } catch (error) {
      console.error('Error creating product:', error.message);
      res.status(500).json({ statusCode: 500, message: error.message });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const product = await ProductService.updateProduct(id, req.body);
      res.status(200).json(product);
    } catch (error) {
      console.error('Error updating product:', error.message);
      res.status(500).json({ statusCode: 500, message: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      await ProductService.deleteProduct(id);
      res.status(200).json({ statusCode: 200, message: 'Product successfully deleted' });
    } catch (error) {
      console.error('Error deleting product:', error.message);
      res.status(500).json({ statusCode: 500, message: error.message });
    }
  }
}

export default ProductController;
