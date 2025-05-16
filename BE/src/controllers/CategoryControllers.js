import CategoryService from "../services/CategoryServices.js";

const CategoryController = {
  create: async (req, res) => {
    try {
      const category = await CategoryService.create(req.body);
      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getAll: async (req, res) => {
    try {
      const categories = await CategoryService.getAll();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getById: async (req, res) => {
    try {
      const category = await CategoryService.getById(req.params.id);
      if (!category) return res.status(404).json({ error: "Not found" });
      res.json(category);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  update: async (req, res) => {
    try {
      const category = await CategoryService.update(req.params.id, req.body);
      res.json(category);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  delete: async (req, res) => {
    try {
      await CategoryService.delete(req.params.id);
      res.json({ message: "Deleted" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default CategoryController;
