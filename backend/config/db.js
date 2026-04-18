import pkg from 'pg';
const { Pool } = pkg;
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// PostgreSQL Connection (Relational Data: Users, Roles, Approvals)
export const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://dms:password@localhost:5432/dms',
});

pgPool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL Database');
});

pgPool.on('error', (err) => {
  console.error('❌ PostgreSQL connection error:', err);
});

// MongoDB Connection (Document metadata, AI extractions)
export const connectMongo = async () => {
  try {
    const mongoUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017/dms';
    await mongoose.connect(mongoUrl);
    console.log('✅ Connected to MongoDB Database');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
  }
};
