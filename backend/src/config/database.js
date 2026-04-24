require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const isProduction = process.env.NODE_ENV === 'production';
const databaseUrl = isProduction
  ? process.env.DATABASE_URL_PRODUCTION || process.env.DATABASE_URL
  : process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    'Missing database URL. Set DATABASE_URL (and optionally DATABASE_URL_PRODUCTION for production).'
  );
}

const adapter = new PrismaPg({ connectionString: databaseUrl });

const prisma = new PrismaClient({
  adapter,
  log: isProduction ? ['error'] : ['query', 'info', 'warn', 'error'],
});

module.exports = prisma;