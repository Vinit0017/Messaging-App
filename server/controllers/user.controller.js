import { matchedData } from "express-validator";
import { getPagination } from "../middlewares/pagination.js";
import prisma from "../config/prisma.js";
import CustomError from "../middlewares/CustomErrors.js";
import * as userQueries from "../queries/user.queries.js";
import { deleteProfile } from "../queries/profile.queries.js";
import crypto from "node:crypto";

export async function findUser(req, res, next) {
    
    try{
        const {usernameOrEmail, page, limit} = matchedData(req);
        console.log("usernameOrEmail", usernameOrEmail);
        if(!usernameOrEmail)throw new CustomError("No username or email found!", 400, "NO_QUERY_FOUND!");   

        const {tPage, tLimit, tSkip} = getPagination(page, limit);
        const users = await userQueries.searchUserByUsernameOrEmail(usernameOrEmail, tSkip, tLimit);
        const totalUsers = users.length;
        if(totalUsers === 0) throw new CustomError("Invalid page search!", 400, "INVALID_QUERY!");

        const formattedData = {
            "users": users.map((u) =>({
                "id": u.id,
                "username": u.username,
                "status": u.status,
                "lastSeenAt": u.lastSeenAt,
            })),
        };

        const pageInformation = {
            "totalUsers": totalUsers,
            "totalPages": Math.ceil(totalUsers/tLimit),
            "currentPage": tPage,
            "pageSize": tLimit,
        };

        return res.status(200).json({
            "data": formattedData,
            "pagination": pageInformation,
        })

    }catch(err){
        next(err);
    }
};

export async function getUser(req, res, next) {
    try{
        const { id } = matchedData(req);
        if(!id) throw new CustomError("No ID found!", 400, "ID_NOT_FOUND!");

        const userSummary = await userQueries.getUserSummary(id);
        if(!userSummary)throw new CustomError("No user summary found!", 404, "USER_NOT_FOUND!");

        const userProfile = await userQueries.getUserProfile(id);
        if(!userProfile) throw new CustomError("No user profile found!", 404, "USER_NOT_FOUND!");

        const formattedData = {
            "id": userSummary.id,
            "username": userSummary.username,
            "status": userSummary.status,
            "lastSeenAt": userSummary.lastSeenAt,
            "profile": {
                "id": userProfile.id,
                "displayName": userProfile.displayName,
                "bio": userProfile.profile,
                "avatarUrl": userProfile.avatarUrl,
            }
        };

        return res.status(200).json({
            "data": formattedData,
        });
    }catch(err){
        next(err);
    }
}

export async function updateUsername(req, res, next) {
    try{
        const {id, username} = matchedData(req);
        const user = req.user;
        if(!user)throw new CustomError("No user found!", 404, "INVALID_REQUEST!");
    
        const updatedUser = await userQueries.updateUsername(user.id, username);
        if(!updatedUser)throw new CustomError("Unable to update username!", 500, "PRISMA_QUERY_ERROR!");
    
        const formattedData = {
            "id": updatedUser.id,
            "username": updatedUser.username,
            "email": updatedUser.email,
        }
    
        return res.status(200).json({
            "data": formattedData,
        });

    }catch(err){
        next(err);
    }
};

export async function deleteUser(req, res, next) {
    try{
        const user = req.user;
        if(!user)throw new CustomError("User not found!", 404, "INVALID_REQUSET!");

        const result = await prisma.$transaction(async (tx) =>{
            const randomSuffix = crypto.randomBytes(4).toString('hex');

            // const userProfile = await userQueries.getUserProfile(user.id, tx);
            // if(!userProfile.profile.id)throw new CustomError("User profile not found!", 404, "INVALID_REQUEST!");

            // await deleteProfile(userProfile.profile.id, tx);
            await userQueries.deleteUser(user.id, randomSuffix, tx);
        });
        console.log(result);

        return res.sendStatus(204);
    }catch(err){
        next(err);
    };
};