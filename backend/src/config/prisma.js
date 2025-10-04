import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
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
  console.log('🔌 Disconnected from database');
});

export default prisma;