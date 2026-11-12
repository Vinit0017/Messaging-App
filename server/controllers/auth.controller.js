import * as userQueries from "../queries/user.queries.js";
import jwt from "jsonwebtoken";
import * as bcrypt from "../config/bcrypt.js";
import CustomError from "../middlewares/CustomErrors.js";

import { matchedData } from "express-validator";

export async function register(req, res, next) {
    try{
        const {username, email, password} = matchedData(req);

        const hashedPassword = await bcrypt.hashPassword(password);

        const user = await userQueries.createUser(username, email, hashedPassword);

        const formattedData = {
            "username": user.username,
            "email": user.email,
            "profiles": user.profiles.map((p) =>({
                "id": p.id,
                "displayName": p.displayName,
                "bio": p.bio,
                "avatarUrl": p.avatarUrl,
            })),
            "friends": user.profiles.map((f) =>({
                "id": f.id,
                "status": f.status,
            })),
        }

        return res.status(201).json(formattedData);
    }catch(err){
        next(err);
    }
};

export async function login(req, res, next) {
    try{
        const {usernameOrEmail, password} = matchedData(req);
        const user = await userQueries.getUserByUsernameOrEmail(usernameOrEmail);

        const ok = user&& (await bcrypt.matchPassword(password, user.password));
        if(!ok) throw new CustomError("Invalid username/password", 401, "INVALID_CREDENTIALS");

        const accessToken = jwt.sign(
            {"id": user.id, "username": user.username, "email": user.email}, 
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: "15m"}
        );

        const refreshToken = jwt.sign(
            {"id": user.id, "username": user.username, "email": user.email},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: "7d"}//7 days
        );

        await userQueries.setRefreshToken(user.id, refreshToken);

        res.status(200)
            .cookie('jwt', refreshToken, 
                {
                    httpOnly: true,
                    maxAge: 7 * 24 * 60 * 60 * 1000
                }
            ).json({
                "accessToken": accessToken,
                "message": "Logged in successfully!"
            })
    }
    catch(err){
        next(err);
    }
};

export async function handleRefreshToken(req, res, next){
    try{
        const cookies = req.cookies;
        if(!cookies?.jwt) throw new CustomError("Refresh Token missing!", 401, "COOKIE_NOT_FOUND!");    
    
        const refreshToken = cookies.jwt;
    
        const foundUser = await userQueries.getUserByRefreshToken(refreshToken);
        if(!foundUser) throw new CustomError("No user found!", 403, "INVALID_TOKEN!");

       let decoded;
        try {
            decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        } catch (err) {
            throw new CustomError("Malformed token!", 403, "INVALID_TOKEN!");
        }

        if (foundUser.id !== decoded.id) {
            throw new CustomError("Malformed token!", 403, "INVALID_TOKEN!");
        }

        const accessToken = jwt.sign(
            { 
                id: decoded.id, 
                username: decoded.username, 
                email: decoded.email 
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" } 
        );
        return res.status(200).json({accessToken});
    }
    catch(err){
        next(err);
    }
};

export async function logout(req, res, next) {
    try{
        const cookies = req.cookies;
        if(!cookies?.jwt)throw new CustomError("Refresh token missing!", 401, "COOKIE_NOT_FOUND!");

        const refreshToken = cookies.jwt;

        const foundUser = await userQueries.getUserByRefreshToken(refreshToken);
        if(!foundUser){
            res.clearCookie('jwt', {httpOnly: true});
            return res.sendStatus(204);
        } 

        await userQueries.setRefreshToken(foundUser.id, null);

        res.clearCookie('jwt', {httpOnly: true});
        return res.sendStatus(204);
    }catch(err){
        next(err);
    }
};