import Faculty from "../models/FacultyModel.js";

const FacultyService = {
  create: async (data) => await Faculty.create(data),
  getAll: async () => await Faculty.find(),
  getById: async (id) => await Faculty.findById(id),
  update: async (id, data) =>
    await Faculty.findByIdAndUpdate(id, data, { new: true }),
  delete: async (id) => await Faculty.findByIdAndDelete(id),
};

export default FacultyService;
