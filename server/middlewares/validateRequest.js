import { validationResult } from "express-validator";

function validateRequest (req, res, next){
    const result = validationResult(req);

    if(!result.isEmpty()){
        const formattedErrors = {};

        for(const error of result.array()){
            if(!formattedErrors[error.path]){
                formattedErrors[error.path] = error.msg;
            }
        }

        return res.status(400).json({
            errors: formattedErrors,
        });
    }
    next();
}

export default validateRequest;