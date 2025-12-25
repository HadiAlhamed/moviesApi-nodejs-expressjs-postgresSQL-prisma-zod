import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import dotenv from 'dotenv';

dotenv.config();
const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });
const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('Database connected via Prisma');
  } catch (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await prisma.$disconnect();
    console.log('Database disconnected via Prisma');
  } catch (err) {
    console.error('Error disconnecting from the database:', err);
    process.exit(1);
  }
};

export { prisma, connectDB, disconnectDB };
