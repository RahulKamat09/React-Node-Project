import express from 'express';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';

const router = express.Router();

const ensureAdminExists = async () => {
  let admin = await Admin.findOne().select('+password');

  if (!admin) {
    const hashedPassword = await bcrypt.hash('admin2323', 10);
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

// GET admin info
router.get('/', async (req, res) => {
  try {
    const admin = await ensureAdminExists();
    const adminData = admin.toObject();
    delete adminData.password;
    res.json(adminData);
  } catch (error) {
    console.error('Error fetching admin:', error);
    res.status(500).json({ error: error.message });
  }
});

// PATCH admin info (partial update)
router.patch('/', async (req, res) => {
  try {
    let admin = await Admin.findOne().select('+password');
    if (!admin) {
      if (req.body.password && !req.body.password.startsWith('$2')) {
        req.body.password = await bcrypt.hash(req.body.password, 10);
      }
      if (req.body.password && !req.body.password.startsWith('$2')) {
        req.body.password = await bcrypt.hash(req.body.password, 10);
      }
      admin = new Admin(req.body);
    } else {
      if (req.body.password && !req.body.password.startsWith('$2')) {
        admin.password = await bcrypt.hash(req.body.password, 10);
        delete req.body.password;
      }
      Object.assign(admin, req.body);
    }
    const savedAdmin = await admin.save();
    const adminData = savedAdmin.toObject();
    delete adminData.password;
    res.json(adminData);
  } catch (error) {
    console.error('Error updating admin:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
