import jwt from "jsonwebtoken";
import CustomError from "./CustomErrors.js";

export function isAuthenticated(req, res, next) {
    try{
        const authHeader = req.headers.authorization || req.headers.Authorization;
        if(!authHeader | !authHeader.startsWith("Bearer ")) throw new CustomError("No auth header found!", 401, "AUTH_HEADER_NOT_AVAILABLE");
    
        const token = authHeader.split(" ")[1];
        if (!token) {
            throw new CustomError("Token missing from auth header!", 401, "TOKEN_MISSING");
        }
    
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        } catch (err) {
            throw new CustomError("Unable to verify token", 403, "TOKEN_VERIFICATION_ERROR");
        }

        req.user = {
            id: decoded.id,
            username: decoded.username,
            email: decoded.email,
        };
        next();
    }catch(err){
        next(err);
    }
}