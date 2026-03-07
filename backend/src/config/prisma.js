import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set. Please add it to your backend environment variables.');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const isProduction = process.env.NODE_ENV === 'production';
const prismaLogLevels = isProduction
  ? ['error']
  : ['query', 'error', 'warn'];

const prisma = new PrismaClient({
  adapter,
  log: prismaLogLevels,
});

// Test connection on startup
prisma.$connect()
  .then(() => {
    console.log('✅ Successfully connected to Supabase database');
  })
  .catch((error) => {
    console.error('❌ Failed to connect to Supabase database:', error.message);
  });

// Handle cleanup on app termination
process.on('beforeExit', async () => {
  await prisma.$disconnect();
  await pool.end();
  console.log('🔌 Disconnected from database');
});

export default prisma;