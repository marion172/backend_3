import ProductModel from '../models/product.model.js';

class ProductRepository {
  static async findAll(queryParams = {}) {
    const { page = 1, limit = 50, status, search, name } = queryParams;
    const parsedPage = Math.max(1, parseInt(page) || 1);
    const parsedLimit = Math.min(100, Math.max(1, parseInt(limit) || 50));
    const skip = (parsedPage - 1) * parsedLimit;

    const filter = {};
    if (status) filter.status = status;
    const searchName = search || name;
    if (searchName) {
      filter.name = { $regex: searchName, $options: 'i' };
    }

    return await ProductModel.find(filter).skip(skip).limit(parsedLimit);
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
    return await ProductModel.findByIdAndUpdate(id, productData, { returnDocument: 'after', runValidators: true });
  }

  static async delete(id) {
    return await ProductModel.findByIdAndDelete(id);
  }

  static async insertMany(productsData) {
    return await ProductModel.insertMany(productsData);
  }
}

export default ProductRepository;
