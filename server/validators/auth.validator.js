import {body} from "express-validator";
import * as userQueries from "../queries/user.queries.js";

export const validateSignUp = [
    body("username")
        .isString().withMessage("Username must be text!")
        .trim()
        .notEmpty().withMessage("Username is required!")
        .isLength({max: 100}).withMessage("Username is too long!")
        .matches(/^[a-zA-Z0-9_]+$/).withMessage("Username can only contain letters, numbers and underscore.")
        .custom( async (value) =>{
            const exists = await userQueries.getUserByUsername(value);
            if(exists) throw new Error("Username already taken!");
        }),

    body("email")
        .isString().withMessage("Email must be a string!")
        .trim()
        .notEmpty().withMessage("Email is required!")
        .isLength({max: 50}).withMessage("Email is too long!")
        .isEmail({allow_utf8_local_part: true}).withMessage("Please provide a valid email!")
        .custom(async (value) =>{
            const exists = await userQueries.getUserByEmail(value);
            if(exists) throw new Error("Email is already under use by another account!");
        }),

    body("password")
        .isString().withMessage("Password must be text!")
        .notEmpty().withMessage("Password cannot be empty")
        .isLength({min: 8, max: 100}).withMessage("Password must be between 8 and 100 characters!")
        .matches(/\d/).withMessage("Password must contain at least one digit.")
        .matches(/[a-z]/).withMessage("Password must contain at least one lowercase character.")
        .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase character.")
        .matches(/[@$!%!*?&]/).withMessage("Password must contain at least one special character."),

    body("confirmPassword")
        .isString().withMessage("Password must be text!")
        .notEmpty().withMessage("Confirm Password field cannot be empty!")
        .custom(async (value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Passwords do not match!");
            }
            return true;
        }),
]

export const validateLogin =[
    body("usernameOrEmail")
        .isString().withMessage("Username or Password must be a string!")
        .trim()
        .notEmpty().withMessage("Username or email is required!")
        .custom((value) =>{
            const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            const isUsername = /^[a-zA-Z0-9_]+$/.test(value);

            if(!isEmail && !isUsername){
                throw new Error("Please enter a valid username or email address!");
            }
            return true;
        }),

    body("password")
        .isString().withMessage("Invalid password!")
        .notEmpty().withMessage("Password cannot be empty!")
        .isLength({min: 8, max: 100}).withMessage("Invalid password!")
        .matches(/\d/).withMessage("Invalid password!")
        .matches(/[a-z]/).withMessage("Invalid password!")
        .matches(/[A-Z]/).withMessage("Invalid password!")
        .matches(/[@$!%!*?&]/).withMessage("Invalid password!"),
        
]