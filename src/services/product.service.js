import ProductRepository from '../repositories/product.repository.js';
import { PRODUCT_STATUS } from '../constants/index.js';

class ProductService {
  static async getAllProducts(query = {}) {
    const products = await ProductRepository.findAll();

    if (query.filterNoStock === 'true') {
      return products.filter(product => product.stock > 0);
    }

    return products;
  }

  static async getProductById(id) {
    const product = await ProductRepository.findById(id);
    if (!product) {
      throw new Error(`Product with ID ${id} not found`);
    }
    return product;
  }

  static async createProduct(productData) {
    const { name, price, stock } = productData;

    if (price < 0) {
      throw new Error('El precio no puede ser negativo');
    }
    if (stock < 0) {
      throw new Error('El stock no puede ser negativo');
    }

    const existingProduct = await ProductRepository.findByName(name);
    if (existingProduct) {
      throw new Error(`El producto '${name}' ya existe`);
    }

    const status = stock === 0 ? PRODUCT_STATUS.OUT_OF_STOCK : PRODUCT_STATUS.AVAILABLE;

    return await ProductRepository.create({
      ...productData,
      status
    });
  }

  static async updateProduct(id, productData) {
    const existingProduct = await ProductRepository.findById(id);
    if (!existingProduct) {
      throw new Error(`El producto con ID ${id} no existe`);
    }

    if (productData.name && productData.name !== existingProduct.name) {
      const duplicate = await ProductRepository.findByName(productData.name);
      if (duplicate) {
        throw new Error(`El producto '${productData.name}' ya existe`);
      }
    }

    if (productData.price !== undefined && productData.price < 0) {
      throw new Error('El precio no puede ser negativo');
    }
    if (productData.stock !== undefined) {
      if (productData.stock < 0) {
        throw new Error('El stock no puede ser negativo');
      }
      productData.status = productData.stock === 0 ? PRODUCT_STATUS.OUT_OF_STOCK : PRODUCT_STATUS.AVAILABLE;
    }

    return await ProductRepository.update(id, productData);
  }

  static async deleteProduct(id) {
    const existingProduct = await ProductRepository.findById(id);
    if (!existingProduct) {
      throw new Error(`El producto con ID ${id} no existe`);
    }
    return await ProductRepository.delete(id);
  }
}

export default ProductService;
