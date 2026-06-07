import mongoose from 'mongoose';

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('\x1b[31m[Database] Connection Error: MONGODB_URI is not set in environment variables.\x1b[0m');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`\x1b[32m[Database] MongoDB Connected: ${conn.connection.host}\x1b[0m`);
  } catch (error) {
    console.error(`\x1b[31m[Database] Connection Error: ${error.message}\x1b[0m`);
    process.exit(1);
  }
};

export default connectDB;
