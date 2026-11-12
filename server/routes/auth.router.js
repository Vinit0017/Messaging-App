import { Router } from "express";
import * as authRouters from "../controllers/auth.controller.js";
import * as authValidators from "../validators/auth.validator.js";
import validateRequest from "../middlewares/validateRequest.js";
import { isAuthenticated } from "../middlewares/userAuthenicator.js";

const router = Router();

router.post("/register", authValidators.validateSignUp, validateRequest, authRouters.register);
router.post("/login", authValidators.validateLogin, validateRequest, authRouters.login);
router.post("/refresh", authRouters.handleRefreshToken);
router.post("/logout", isAuthenticated, authRouters.logout);

export default router;