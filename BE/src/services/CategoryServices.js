import Category from "../models/CategoryModel.js";

const CategoryService = {
  create: async (data) => await Category.create(data),
  getAll: async () => await Category.find(),
  getById: async (id) => await Category.findById(id),
  update: async (id, data) =>
    await Category.findByIdAndUpdate(id, data, { new: true }),
  delete: async (id) => await Category.findByIdAndDelete(id),
};

export default CategoryService;
