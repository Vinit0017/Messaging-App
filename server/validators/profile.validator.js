import {body} from "express-validator"

export const profileBodyValidator = [
    body('displayName')
        .isString().withMessage("Name must be a string!")
        .trim()
        .notEmpty().withMessage("Display name cannot be empty!")
        .isLength({max: 25}).withMessage("Name is too long!"),
    
    body('bio')
        .optional()
        .isString().withMessage("Bio must be string!")
        .trim()
        .isLength({max: 200}).withMessage("Bio is too long!")
        .notEmpty().withMessage("Bio cannot be empty!"),

    body('avatarUrl')
        .optional()
        .isString().withMessage("Avatar must be string!")
        .trim()
        .notEmpty().withMessage("Avatar url cannot be empty!"),
]