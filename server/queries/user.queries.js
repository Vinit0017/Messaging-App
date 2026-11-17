import prisma from "../config/prisma.js";

export async function createUser(username, email, password){
    return prisma.user.create({
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

export async function getUserByUsernameOrEmail(usernameOrEmail) {
    return prisma.user.findFirst({
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

export async function getUserByRefreshToken(refreshToken) {
    return prisma.user.findUnique({
        where:{
            refreshToken: refreshToken,
        }
    });
};

export async function setRefreshToken(userId, value) {
    return prisma.user.update({
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

export async function getUserSummary(userId){
    return prisma,user.findUnique({
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

export async function getUserProfile(userId) {
    return prisma.user.findUnique({
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
                    createdAt: true
                },
            },
        },
    });
};

export async function getUserConversations(userId) {
    return prisma.user.findUnique({
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