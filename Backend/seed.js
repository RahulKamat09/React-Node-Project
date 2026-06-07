import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import Product from './models/Product.js';
import Category from './models/Category.js';
import Customer from './models/Customer.js';
import Order from './models/Order.js';
import Review from './models/Review.js';
import Message from './models/Message.js';
import Address from './models/Address.js';
import Admin from './models/Admin.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    const dbPath = path.join(process.cwd(), 'db.json');
    if (!fs.existsSync(dbPath)) {
      console.error(`db.json not found at ${dbPath}`);
      process.exit(1);
    }

    const data = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

    // Clear existing collections
    console.log('Clearing existing collections...');
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Customer.deleteMany({});
    await Order.deleteMany({});
    await Review.deleteMany({});
    await Message.deleteMany({});
    await Address.deleteMany({});
    await Admin.deleteMany({});
    console.log('Collections cleared.');

    const stripId = (item) => {
      const { id, ...rest } = item;
      return rest;
    };

    // Seed Products
    if (data.products && Array.isArray(data.products)) {
      await Product.insertMany(data.products.map(stripId));
      console.log(`Seeded ${data.products.length} products.`);
    }

    // Seed Categories
    if (data.categories && Array.isArray(data.categories)) {
      await Category.insertMany(data.categories.map(stripId));
      console.log(`Seeded ${data.categories.length} categories.`);
    }

    // Seed Customers
    if (data.customers && Array.isArray(data.customers)) {
      await Customer.insertMany(data.customers.map(stripId));
      console.log(`Seeded ${data.customers.length} customers.`);
    }

    // Seed Orders
    if (data.orders && Array.isArray(data.orders)) {
      await Order.insertMany(data.orders.map(stripId));
      console.log(`Seeded ${data.orders.length} orders.`);
    }

    // Seed Reviews
    if (data.reviews && Array.isArray(data.reviews)) {
      const normalizedReviews = data.reviews.map((r) => ({
        ...stripId(r),
        productId: String(r.productId)
      }));
      await Review.insertMany(normalizedReviews);
      console.log(`Seeded ${normalizedReviews.length} reviews.`);
    }

    // Seed Messages
    if (data.messages && Array.isArray(data.messages)) {
      await Message.insertMany(data.messages.map(stripId));
      console.log(`Seeded ${data.messages.length} messages.`);
    }

    // Seed Addresses
    if (data.addresses && Array.isArray(data.addresses)) {
      await Address.insertMany(data.addresses.map(stripId));
      console.log(`Seeded ${data.addresses.length} addresses.`);
    }

    // Seed Admin
    if (data.admin) {
      await Admin.create(data.admin);
      console.log('Seeded admin details.');
    }

    console.log('\x1b[32mDatabase Seeding Completed Successfully! 🎉\x1b[0m');
    process.exit(0);
  } catch (error) {
    console.error('\x1b[31mError seeding database:\x1b[0m', error);
    process.exit(1);
  }
};

seedData();
