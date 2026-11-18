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
            profileId: true,
        }
    });
};