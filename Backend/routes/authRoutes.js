import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';
import Customer from '../models/Customer.js';

const router = express.Router();

const createToken = (payload) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured in environment variables');
  }

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const hashPassword = async (password) => bcrypt.hash(password, 10);

const verifyPassword = async (plainPassword, storedPassword, docToUpdate) => {
  if (!storedPassword) return false;

  if (storedPassword.startsWith('$2')) {
    return bcrypt.compare(plainPassword, storedPassword);
  }

  if (plainPassword === storedPassword) {
    if (docToUpdate) {
      docToUpdate.password = await hashPassword(plainPassword);
      await docToUpdate.save();
    }
    return true;
  }

  return false;
};

const ensureAdminExists = async () => {
  let admin = await Admin.findOne().select('+password');

  if (!admin) {
    const defaultPassword = 'admin2323';
    const hashedPassword = await hashPassword(defaultPassword);

    admin = new Admin({
      name: 'Admin',
      email: 'admin@shopaura.com',
      phone: '7203806609',
      password: hashedPassword,
    });

    await admin.save();
  }

  return admin;
};

router.post('/register', async (req, res) => {
  try {
    const { name, email, phone = '', password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existingEmail = await Customer.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: 'This email is already registered' });
    }

    const existingPhone = phone ? await Customer.findOne({ phone }) : null;
    if (existingPhone) {
      return res.status(400).json({ error: 'This phone number is already registered' });
    }

    const hashedPassword = await hashPassword(password);
    const newCustomer = new Customer({
      name,
      email,
      phone,
      password: hashedPassword,
      registered: new Date().toISOString().split('T')[0],
      status: 'Active',
    });

    const savedUser = await newCustomer.save();
    const token = createToken({ id: savedUser._id.toString(), role: 'user', email: savedUser.email });

    const user = savedUser.toObject();
    delete user.password;

    res.status(201).json({ token, role: 'user', user });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Unable to create account', message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const admin = await ensureAdminExists();
    if (admin?.email === email) {
      const isAdminPasswordValid = await verifyPassword(password, admin.password, admin);
      if (!isAdminPasswordValid) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const adminPayload = { id: admin._id.toString(), role: 'admin', email: admin.email };
      const token = createToken(adminPayload);

      const adminData = admin.toObject();
      delete adminData.password;

      return res.json({ token, role: 'admin', user: adminData });
    }

    const user = await Customer.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isUserPasswordValid = await verifyPassword(password, user.password, user);
    if (!isUserPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (user.status !== 'Active') {
      return res.status(403).json({ error: 'Your account is inactive. Please contact support.' });
    }

    const userPayload = { id: user._id.toString(), role: 'user', email: user.email };
    const token = createToken(userPayload);

    const userData = user.toObject();
    delete userData.password;

    res.json({ token, role: 'user', user: userData });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Unable to authenticate user', message: error.message });
  }
});

export default router;
