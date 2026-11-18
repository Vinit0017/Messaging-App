import { query, param, body } from "express-validator";
import * as userQueries from "../queries/user.queries.js";

export const userQueryValidator = [
    query('usernameOrEmail')
        .isString().withMessage("Username or email must be a string!")
        .trim()
        .notEmpty().withMessage('Username or email is required!'),
];

export const userParamValidator = [
    param('id')
        .isString().withMessage("Id must be string!")
        .trim()
        .notEmpty().withMessage("Id cannot be empty!")
        .isLength({min: 10, max: 72}).withMessage("Id is too long or too short!"),
];

export const updateUsernameValidator = [
    body('username')
        .isString().withMessage("Username must be text!")
        .trim()
        .notEmpty().withMessage("Username is required!")
        .isLength({max: 100}).withMessage("Username is too long!")
        .matches(/^[a-zA-Z0-9_]+$/).withMessage("Username can only contain letters, numbers and underscore.")
        .custom( async (value) =>{
            const exists = await userQueries.getUserByUsernameOrEmail(value);
            if(exists) throw new Error("Username already taken!");
        }),
]
