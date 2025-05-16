import express from "express";
import FacultyController from "../controllers/FacultyControllers.js";

const router = express.Router();

router.post("/create", FacultyController.create);
router.get("/getAll", FacultyController.getAll);
router.get("/get/:id", FacultyController.getById);
router.post("/update/:id", FacultyController.update);
router.delete("/del/:id", FacultyController.delete);

export default router;
