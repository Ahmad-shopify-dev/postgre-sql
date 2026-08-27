import { prisma, pool } from "./src/config/prisma.js";
import { handleCreateNewUser, handleGetUsers } from "./src/controller/userController.js";



async function mainPrismaProcess() {
    console.log("______ BEGIN PRISMA PROCCESS ______");

    // const newUser = await handleCreateNewUser({
    //     name: "Sophia Chen",
    //     email: "sophia.chen@techcorp.io",
    //     age: 34,
    //     isActive: false,
    //     posts: [
    //         {
    //             title: "Dockerizing Express & Prisma Apps",
    //             content: "Setting up docker-compose for PostgreSQL, Node backend, and Prisma migrations...",
    //             published: false
    //         },
    //         {
    //             title: "CI/CD Pipelines with GitHub Actions",
    //             content: "Automating testing and deployment on AWS EC2 instances...",
    //             published: true
    //         }
    //     ]
    // })
    // return newUser;

    const users = await handleGetUsers();
    return users;
}


mainPrismaProcess()
    .then(data => {
        console.log(data)
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
        console.log("______ PROCESS CLOSED SUSSCCESFULLY ______");
    })

