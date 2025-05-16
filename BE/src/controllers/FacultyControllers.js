import FacultyService from "../services/FacultyServices.js";

const FacultyController = {
  create: async (req, res) => {
    try {
      const faculty = await FacultyService.create(req.body);
      res.status(201).json(faculty);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getAll: async (req, res) => {
    try {
      const faculties = await FacultyService.getAll();
      res.json(faculties);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getById: async (req, res) => {
    try {
      const faculty = await FacultyService.getById(req.params.id);
      if (!faculty) return res.status(404).json({ error: "Not found" });
      res.json(faculty);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  update: async (req, res) => {
    try {
      const faculty = await FacultyService.update(req.params.id, req.body);
      res.json(faculty);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  delete: async (req, res) => {
    try {
      await FacultyService.delete(req.params.id);
      res.json({ message: "Deleted" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default FacultyController;
