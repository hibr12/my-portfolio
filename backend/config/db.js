import prisma from './prisma.js';

const connectDB = async () => {
  let retries = 5;
  while (retries > 0) {
    try {
      await prisma.$connect();
      console.log('PostgreSQL connected via Prisma');
      return;
    } catch (error) {
      retries--;
      console.error(`Database connection error (${5 - retries}/5): ${error.message}`);
      if (retries === 0) {
        process.exit(1);
      }
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
};

export default connectDB;
