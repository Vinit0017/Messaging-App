import { matchedData } from "express-validator";
import * as userQueries from "../queries/user.queries.js";
import * as profileQueries from "../queries/profile.queries.js";

export async function currentUserProfile(req, res, next) {
    try{
        const user = req.user;
        if(!user) throw new CustomError("No user found!", 404, "INVALID_REQUEST!");

        const userProfile = await userQueries.getUserProfile(user.id);
        if(userProfile?.profile?.id === null) throw new CustomError("No user profile found!", 404, "INVALID_REQUEST!");

        const formattedProfile = {
            "id": userProfile.profile.id,
            "displayName": userProfile.profile.displayName,
            "bio": userProfile.profile.bio,
            "avatarUrl": userProfile.profile.avatarUrl,
        };

        return res.status(200).json({
            "data":{
                "profile": formattedProfile,
            }
        });
    }
    catch(err){
        next(err);
    }
};

export async function createProfile(req, res, next) {
    try{
        const user = req.user;
        if(!user) throw new CustomError("No user found!", 404, "INVALID_REQUEST!");

        const {displayName, bio, avatarUrl} = matchedData(req);

        const createdUser = await profileQueries.createProfile({userId: user.id, displayName: displayName, bio: bio, avatarUrl: avatarUrl});

        const formattedProfile = {
            "id": createdUser.id,
            "userId": createdUser.userId,
            "displayName": createdUser.displayName,
            "bio": createdUser.bio,
            "avatarUrl": createdUser.avatarUrl
        };

        return res.status(201).json({
            "data": {
                "profile": formattedProfile,
            },
        });
    }catch(err){
        next(err);
    };
};

export async function updateProfile(req, res, next){
    try{
        const {displayName, bio, avatarUrl} = matchedData(req);
        const user = req.user;
        console.log(avatarUrl);
        if(!user) throw new CustomError("No user found!", 404, "INVALID_REQUEST!");

        const userProfile = await userQueries.getUserProfile(user.id);
        if(!userProfile?.profile) throw new CustomError("No user profile found!", 404, "INVALID_REQUEST!");

        const updatedProfile = await profileQueries.updateProfile(userProfile.profile.id, {displayName: displayName, bio: bio, avatarUrl: avatarUrl});

        const formattedProfile = {
            "id": updatedProfile.id,
            "displayName": updatedProfile.displayName,
            "bio": updatedProfile.bio,
            "avatarUrl": updatedProfile.avatarUrl,
            "userId": updatedProfile.userId,
        };

        return res.status(200).json({
            "data":{
                "profile": formattedProfile,
            },
        });
    }catch(err){
        next(err);
    }
}

