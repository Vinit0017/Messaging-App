import prisma from "../config/prisma.js";

export async function createUser(username, email, password, tx=prisma){
    return tx.user.create({
        data:{
            username: username,
            password: password,
            email: email,
        },
        select:{
            id: true,
            username: true,
            email: true,
            createdAt: true,
            status: true,
        },
    });
};

export async function getUserByUsernameOrEmail(usernameOrEmail, tx=prisma) {
    return tx.user.findFirst({
        where:{
            OR:[
                {email: usernameOrEmail},
                {username: usernameOrEmail}
            ],
        },
        select:{
            id: true,
            username: true,
            email: true,
            password: true,
            status: true,
        },
    });
};

export async function searchUserByUsernameOrEmail(usernameOrEmail, skip, limit, tx=prisma) {
    return tx.user.findMany({
        where:{
            OR:[
                {
                    username: {
                        contains: usernameOrEmail,
                        mode: 'insensitive',
                    },
                },
                {
                    email:{
                        contains: usernameOrEmail,
                        mode: 'insensitive',
                    },
                },
            ],
        },
        select:{
            id: true,
            username: true,
            email: true,
            status: true,
            lastSeenAt: true,
        },
        orderBy: {username: "desc"},
        skip: skip,
        take: limit,
    })
}

export async function getUserByRefreshToken(refreshToken, tx=prisma) {
    return tx.user.findUnique({
        where:{
            refreshToken: refreshToken,
        }
    });
};

export async function setRefreshToken(userId, value, tx=prisma) {
    return tx.user.update({
        where: {
            id: userId,
        },
        data:{
            refreshToken: value,
        },
        select:{
            id: true,
            username: true,
            email: true,
            refreshToken: true,
        }
    })
};

export async function getUserSummary(userId, tx=prisma){
    return tx.user.findUnique({
        where:{
            id: userId,
        },
        select:{
            id:true,
            username: true,
            email: true,
            status: true,
            lastSeenAt: true,
        },
    });
};

export async function getUserProfile(userId, tx=prisma) {
    return tx.user.findUnique({
        where:{
            id:userId,
        },
        select:{
            profile:{
                select:{
                    id: true,
                    displayName: true,
                    bio: true,
                    avatarUrl: true,
                },
            },
        },
    });
};

export async function getUserConversations(userId, tx=prisma) {
    return tx.user.findUnique({
        where:{
            id: userId,
        },
        select:{
            conversations:{
                select: true,
                createdAt: true,
                name: true,
                userId: true,
            },
        },
    });
};

export async function updateUsername(userId, newUsername, tx=prisma){
    return tx.user.update({
        where:{
            id: userId
        },
        data:{
            username: newUsername,
        },
        select:{
            id: true,
            username: true,
            email: true,
        },
    });
};

export async function deleteUser(userId, randomSuffix, tx=prisma) {
    return tx.user.update({
        where:{
            id: userId,
        },
        data:{
            username: `deleted_user_${randomSuffix}`,
            email: `deleted_${userId}@sys.local`,
            password: `324f4de10cacf35d4ed1dd0158c8cc177c6d9654`,
            refreshToken: null,
            deletedAt: new Date(),
        },
        select:{
            deletedAt: true,
        }
    });
};