import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import authRouter from './routes/authRoutes.js';
import { authenticateToken, authorizeRole } from './middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

// Load models
import Product from './models/Product.js';
import Category from './models/Category.js';
import Customer from './models/Customer.js';
import Order from './models/Order.js';
import Review from './models/Review.js';
import Message from './models/Message.js';
import Address from './models/Address.js';

// Load routers
import { createGenericRouter } from './routes/genericRoutes.js';
import adminRouter from './routes/adminRoutes.js';

const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Initialize Express
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Request logger middleware
app.use((req, res, next) => {
  console.log(`\x1b[36m[Request] ${req.method} ${req.originalUrl}\x1b[0m`);
  next();
});

// API Routes
app.use('/auth', authRouter);
app.use('/products', createGenericRouter(Product));
app.use('/categories', createGenericRouter(Category));
app.use('/customers', authenticateToken, createGenericRouter(Customer));
app.use('/orders', authenticateToken, createGenericRouter(Order));
app.use('/reviews', authenticateToken, createGenericRouter(Review));
app.use('/messages', authenticateToken, createGenericRouter(Message));
app.use('/addresses', authenticateToken, createGenericRouter(Address));
app.use('/admin', authenticateToken, authorizeRole('admin'), adminRouter);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('\x1b[31m[Error] Global Error Handler:\x1b[0m', err.message);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Start Server
app.listen(PORT, () => {
  console.log(`\x1b[32m[Server] Express running on port ${PORT}\x1b[0m`);
});