import ProductRepository from '../repositories/product.repository.js';
import { PRODUCT_STATUS } from '../constants/index.js';
import CustomError from '../errors/custom.error.js';
import logger from '../config/logger.js';

class ProductService {
  static async getAllProducts() {
    const products = await ProductRepository.findAll();
    return products;
  }

  static async getProductById(id) {
    const product = await ProductRepository.findById(id);
    if (!product) {
      logger.warning(`Product #${id} not found`);
      throw new CustomError('PRODUCT_NOT_FOUND');
    }
    return product;
  }

  static async createProduct(productData) {
    const { name, price, stock } = productData;
    if (price < 0) {
      logger.warning(`Invalid price for product: ${price}`);
      throw new CustomError('PRODUCT_PRICE_ERROR');
    }
    if (stock < 0) {
      logger.warning(`Invalid stock for product: ${stock}`);
      throw new CustomError('PRODUCT_QUANTITY_ERROR');
    }

    const existingProduct = await ProductRepository.findByName(name);
    if (existingProduct) {
      logger.warning(`Product with name "${name}" already exists`);
      throw new CustomError('PRODUCT_ALREADY_EXISTS');
    }

    const status = stock === 0 ? PRODUCT_STATUS.OUT_OF_STOCK : PRODUCT_STATUS.AVAILABLE;

    const newProduct = await ProductRepository.create({
      ...productData,
      status
    });
    logger.info(`Product #${newProduct._id} created successfully`);
    return newProduct;
  }

  static async updateProduct(id, productData) {
    const existingProduct = await ProductRepository.findById(id);
    if (!existingProduct) {
      logger.warning(`Product #${id} not found to update`);
      throw new CustomError('PRODUCT_NOT_FOUND');
    }

    if (productData.price !== undefined && productData.price < 0) {
      logger.warning(`Invalid price for product #${id}: ${productData.price}`);
      throw new CustomError('PRODUCT_PRICE_ERROR');
    }
    if (productData.stock !== undefined) {
      if (productData.stock < 0) {
        logger.warning(`Invalid stock for product #${id}: ${productData.stock}`);
        throw new CustomError('PRODUCT_QUANTITY_ERROR');
      }
      productData.status = productData.stock === 0 ? PRODUCT_STATUS.OUT_OF_STOCK : PRODUCT_STATUS.AVAILABLE;
    }

    return await ProductRepository.update(id, productData);
  }

  static async deleteProduct(id) {
    const existingProduct = await ProductRepository.findById(id);
    if (!existingProduct) {
      logger.warning(`Product #${id} not found to delete`);
      throw new CustomError('PRODUCT_NOT_FOUND');
    }
    return await ProductRepository.delete(id);
  }
}

export default ProductService;
