import pkg from "pg"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../../generated/prisma/client.ts"
import "dotenv/config"


const { Pool } = pkg;
const connectionString = process.env.DATABASE_URL;

// Connection Pool & Adapter Setup
const pool = new Pool({ connectionString });  
const adapter = new PrismaPg(pool);

// Single Prisma Instance Export
export const prisma = new PrismaClient({ adapter })
export { pool };
