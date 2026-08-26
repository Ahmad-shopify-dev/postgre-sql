import { prisma } from "../config/prisma.js";

// CREATE NEW USERS BASED ON GIVEN DATA
export const createNewUser = async (userdata) => {
    const userCreated = await prisma.user.create({
        data: {
            name: userdata.name,
            email: userdata.email,
            age: userdata.age,
            isActive: userdata.isActive,
            posts: userdata.posts || []
        },
        include: {
            posts: true
        }
    });
    return userCreated;
}

// GET ALL USERS FROM THE DATABASE
export const getAllUsers = async () => {
    const users = await prisma.user.findMany({
        include: {
            posts: true
        }
    });
    return users;
}

