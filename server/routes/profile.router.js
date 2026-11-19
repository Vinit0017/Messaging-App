import { Router } from "express";
import { isAuthenticated } from "../middlewares/userAuthenicator.js";
import * as profileControllers from "../controllers/profile.controller.js";
import { profileBodyValidator } from "../validators/profile.validator.js";
import validateRequest from "../middlewares/validateRequest.js";

const router = Router();

router.get("/me", isAuthenticated, profileControllers.currentUserProfile);
router.post("/", isAuthenticated, profileBodyValidator, validateRequest, profileControllers.createProfile);
router.put("/me/update", isAuthenticated, profileBodyValidator, validateRequest, profileControllers.updateProfile);

export default router;