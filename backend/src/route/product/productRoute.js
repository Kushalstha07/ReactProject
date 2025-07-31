import express from "express";
import { productController } from "../../controller/product/productController.js";
import upload from "../../middleware/multerConfig.js";
const router = express.Router();

router.get("/", productController.getAll);
router.get("/:id", productController.getById);
router.post("/", upload.single('image'), productController.create);
router.put("/:id", upload.single('image'), productController.update);
router.delete("/:id", productController.deleteById);

export { router as productRouter }; 