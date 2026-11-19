import { Router } from "express";
import * as userControllers from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/userAuthenicator.js";
import { updateUsernameValidator, userParamValidator, userQueryValidator } from "../validators/user.validators.js";
import { paginationValidator } from "../validators/page.valdiator.js";
import validateRequest from "../middlewares/validateRequest.js";

const router = Router();

router.get("/search", userQueryValidator, paginationValidator, validateRequest, userControllers.findUser);
router.get("/:id", userParamValidator, validateRequest, userControllers.getUser);
router.post("/:id", isAuthenticated, userParamValidator, updateUsernameValidator, validateRequest, userControllers.updateUsername);
router.delete("/:id", isAuthenticated, userControllers.deleteUser);

export default router;