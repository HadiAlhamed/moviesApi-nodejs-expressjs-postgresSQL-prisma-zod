import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

const prisma = new PrismaClient({
  adapter: adapter,
  log:
    process.env.NODE_ENV === 'development'
      ? ['query', 'warn', 'error']
      : ['error'],
});

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
