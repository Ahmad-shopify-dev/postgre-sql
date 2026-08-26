import { prisma, pool } from "./src/config/prisma.js";
import { handleGetUsers } from "./src/controller/userController.js";



async function mainPrismaProcess() {
    console.log("______ BEGIN PRISMA PROCCESS ______");
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

