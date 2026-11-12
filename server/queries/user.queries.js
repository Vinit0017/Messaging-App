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
            profiles: {
                select: {
                    id: true,
                    displayName: true,
                    bio: true,
                    avatarUrl: true
                },
            },
            friends: {
                select:{
                    friendId: true,
                    status: true,
                }
            }
        },
    });
};

export async function getUserByUsername(username) {
    return prisma.user.findUnique({
        where: {
            username: username,
        },
    });
};

export async function getUserByEmail(email) {
    return prisma.user.findUnique({
        where: {
            email: email,
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

export async function setRefreshToken(id, value) {
    return prisma.user.update({
        where: {
            id: id,
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
}