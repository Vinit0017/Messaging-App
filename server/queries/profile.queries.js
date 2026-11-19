import prisma from "../config/prisma.js";

export async function deleteProfile(profileId, tx=prisma) {
    return tx.profile.update({
        where:{
            id: profileId,
        },
        data:{
            displayName: "Deleted User",
            bio: null,
            avatarUrl: null,
        },
        select:{
            id: true,
        }
    });
};

export async function getUserProfile(profileId, tx=prisma){
    return tx.profile.findUnique({
        where:{
            id: profileId,
        },
        select:{
            id: true,
            bio: true,
            userId: true,
            displayName: true,
            avatarUrl: true,
        },
    });
};

export async function createProfile({userId, displayName, bio, avatarUrl}, tx=prisma){
    return tx.profile.create({
        data:{
            userId: userId,
            displayName: displayName,
            bio: bio,
            avatarUrl: avatarUrl
        },
        select:{
            id: true,
            userId: true,
            displayName: true,
            bio: true,
            avatarUrl: true
        },
    });
};

export async function updateProfile(profileId, {displayName, bio, avatarUrl}, tx=prisma) {
    return tx.profile.update({
        where:{
            id: profileId,
        },
        data:{
            displayName: displayName,
            bio: bio,
            avatarUrl: avatarUrl,
        },
        select:{
            id: true,
            displayName: true,
            bio: true,
            avatarUrl: true,
            userId: true,
        },
    });
};