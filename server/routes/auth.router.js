import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import * as authValidators from "../validators/auth.validator.js";
import validateRequest from "../middlewares/validateRequest.js";
import { isAuthenticated } from "../middlewares/userAuthenicator.js";

const router = Router();

router.post("/register", authValidators.validateSignUp, validateRequest, authController.register);
router.post("/login", authValidators.validateLogin, validateRequest, authController.login);
router.post("/refresh", authController.handleRefreshToken);
router.post("/logout", isAuthenticated, authController.logout);
router.get("/me", isAuthenticated, authController.currentUser);

export default router;