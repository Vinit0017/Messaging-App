import { PrismaClient } from "../prisma/generated/prisma/index.js";

function errorHandler(err, req, res, next){
    console.log(err);
    if(err instanceof PrismaClient.PrismaClientValidationError){
        return res
            .status(400)
            .json({
                error:{
                    code: "INVALID_QUERY",
                    message: "Invalid query parameters provided."
                }
            })
    }

    return res.status(err.statusCode || 500).json({
        error: {
            code: err.statusCode || "SERVER_ERROR",
            message: err.message || "Internal Server Error!"
        }
    });
}

export default errorHandler;