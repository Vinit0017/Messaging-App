import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../prisma/generated/prisma/index.js";

const connectionString = `${process.env.LOCAL_DATABASE_URL}`;

const adapter = new PrismaPg({connectionString});
const prisma = new PrismaClient({adapter});

export default prisma;