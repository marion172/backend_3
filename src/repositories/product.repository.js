import ProductModel from '../models/product.model.js';

class ProductRepository {
  static async findAll() {
    return await ProductModel.find();
  }

  static async findById(id) {
    return await ProductModel.findById(id);
  }

  static async findByName(name) {
    return await ProductModel.findOne({ name });
  }

  static async create(productData) {
    const product = new ProductModel(productData);
    return await product.save();
  }

  static async update(id, productData) {
    return await ProductModel.findByIdAndUpdate(id, productData, { new: true, runValidators: true });
  }

  static async delete(id) {
    return await ProductModel.findByIdAndDelete(id);
  }

  static async insertMany(productsData) {
    return await ProductModel.insertMany(productsData);
  }
}

export default ProductRepository;
