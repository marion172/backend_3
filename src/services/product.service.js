import ProductRepository from '../repositories/product.repository.js';
import { PRODUCT_STATUS } from '../constants/index.js';
import CustomError from '../errors/custom.error.js';

class ProductService {
  static async getAllProducts() {
    const products = await ProductRepository.findAll();
    return products;
  }

  static async getProductById(id) {
    const product = await ProductRepository.findById(id);
    if (!product) {
      throw new CustomError('PRODUCT_NOT_FOUND');
    }
    return product;
  }

  static async createProduct(productData) {
    const { name, price, stock } = productData;
    if (price < 0) {
      throw new CustomError('PRODUCT_PRICE_ERROR');
    }
    if (stock < 0) {
      throw new CustomError('PRODUCT_QUANTITY_ERROR');
    }

    const existingProduct = await ProductRepository.findByName(name);
    if (existingProduct) {
      throw new CustomError('PRODUCT_ALREADY_EXISTS');
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
      throw new CustomError('PRODUCT_NOT_FOUND');
    }

    if (productData.price !== undefined && productData.price < 0) {
      throw new CustomError('PRODUCT_PRICE_ERROR');
    }
    if (productData.stock !== undefined) {
      if (productData.stock < 0) {
        throw new CustomError('PRODUCT_QUANTITY_ERROR');
      }
      productData.status = productData.stock === 0 ? PRODUCT_STATUS.OUT_OF_STOCK : PRODUCT_STATUS.AVAILABLE;
    }

    return await ProductRepository.update(id, productData);
  }

  static async deleteProduct(id) {
    const existingProduct = await ProductRepository.findById(id);
    if (!existingProduct) {
      throw new CustomError('PRODUCT_NOT_FOUND');
    }
    return await ProductRepository.delete(id);
  }
}

export default ProductService;
