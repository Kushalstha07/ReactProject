import express from "express";
import { userController } from "../../controller/index.js";
import { authenticateToken } from "../../middleware/token-middleware.js";

const router = express.Router();

// Public routes (no authentication required)
router.post("/", userController.create); // Registration

// Protected routes (authentication required)
router.get("/", authenticateToken, userController.getAll);
router.put("/:id", authenticateToken, userController.update);
router.get("/:id", authenticateToken, userController.getById);
router.delete("/:id", authenticateToken, userController.delelteById);

export { router as userRouter };
