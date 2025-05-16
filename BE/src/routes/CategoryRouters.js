import express from "express";
import CategoryController from "../controllers/CategoryControllers.js";

const router = express.Router();

router.post("/create", CategoryController.create);
router.get("/getAll", CategoryController.getAll);
router.get("/:id", CategoryController.getById);
router.post("/update/:id", CategoryController.update);
router.delete("/del/:id", CategoryController.delete);

export default router;
