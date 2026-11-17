export async function getUserFriends(userId) {
    const friendships = await prisma.friendships.findMany({
        where:{
            status: "ACCEPTED",
            OR: [
                {user1Id: userId},
                {user2Id: userId}
            ]
        },
        select:{
            user1: {
                id: true,
                username: true,
                profile: true,
                status: true
            },
            user2:{
                select:{
                    id: true,
                    username: true,
                    profile: true,
                    status: true
                }
            }
        },
    });

    return friendships.map(friendship =>{
        return friendship.user1Id === userId?
            friendship.user2: 
            friendship.user1
    });
}