import { Prisma } from "../prisma/generated/prisma/index.js";

function errorHandler(err, req, res, next){
    console.log(err);
    if (err.name === "PrismaClientValidationError" || err.constructor.name === "PrismaClientValidationError") {
        return res.status(400).json({
            error: {
                code: "INVALID_QUERY",
                message: "Invalid query parameters or data provided."
            }
        });
    }

    if (err.code === "P2002") {
        return res.status(409).json({
            error: {
                code: "DUPLICATE_ENTRY",
                message: "A record with this value already exists."
            }
        });
    }

    return res.status(err.statusCode || 500).json({
        error: {
            code: err.statusCode || "SERVER_ERROR",
            message: err.message || "Internal Server Error!"
        }
    });
}

export default errorHandler;