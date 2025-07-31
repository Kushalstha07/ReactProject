import express from "express";
import { authController } from "../../controller/index.js";
import { authenticateToken } from "../../middleware/token-middleware.js";

const router = express.Router();
router.get("/init", authenticateToken, authController.init);
router.post("/login", authController.login);

export { router as authRouter };
