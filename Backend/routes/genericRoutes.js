import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { parseQuery } from '../middleware/queryParser.js';

const buildIdQuery = (id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return { _id: id };
  }
  return { id };
};

export const createGenericRouter = (Model) => {
  const router = express.Router();

  // GET all items with filters, sorting, limit
  router.get('/', parseQuery, async (req, res) => {
    try {
      let query = Model.find(req.mongoFilter);
      
      if (req.mongoSort && Object.keys(req.mongoSort).length > 0) {
        query = query.sort(req.mongoSort);
      }
      
      if (req.mongoLimit && req.mongoLimit > 0) {
        query = query.limit(req.mongoLimit);
      }
      
      const items = await query.exec();
      res.json(items);
    } catch (error) {
      console.error(`Error in GET / for ${Model.modelName}:`, error);
      res.status(500).json({ error: error.message });
    }
  });

  // GET single item by MongoDB ObjectId or legacy id
  router.get('/:id', async (req, res) => {
    try {
      const item = await Model.findOne(buildIdQuery(req.params.id));
      if (!item) {
        return res.status(404).json({ error: 'Not Found' });
      }
      res.json(item);
    } catch (error) {
      console.error(`Error in GET /:id for ${Model.modelName}:`, error);
      res.status(500).json({ error: error.message });
    }
  });

  // POST create item
  router.post('/', async (req, res) => {
    try {
      const body = { ...req.body };
      delete body.id;

      if (body.password && !body.password.startsWith('$2')) {
        body.password = await bcrypt.hash(body.password, 10);
      }

      const newItem = new Model(body);
      const savedItem = await newItem.save();
      res.status(201).json(savedItem);
    } catch (error) {
      console.error(`Error in POST for ${Model.modelName}:`, error);
      res.status(500).json({ error: error.message });
    }
  });

  // PUT update completely by MongoDB ObjectId or legacy id
  router.put('/:id', async (req, res) => {
    try {
      const body = { ...req.body };
      delete body.id;

      if (body.password && !body.password.startsWith('$2')) {
        body.password = await bcrypt.hash(body.password, 10);
      }

      const updatedItem = await Model.findOneAndUpdate(
        buildIdQuery(req.params.id),
        body,
        { new: true, runValidators: true, overwrite: true }
      );
      if (!updatedItem) {
        return res.status(404).json({ error: 'Not Found' });
      }
      res.json(updatedItem);
    } catch (error) {
      console.error(`Error in PUT /:id for ${Model.modelName}:`, error);
      res.status(500).json({ error: error.message });
    }
  });

  // PATCH update partially by MongoDB ObjectId or legacy id
  router.patch('/:id', async (req, res) => {
    try {
      const body = { ...req.body };
      delete body.id;

      if (body.password && !body.password.startsWith('$2')) {
        body.password = await bcrypt.hash(body.password, 10);
      }

      const updatedItem = await Model.findOneAndUpdate(
        buildIdQuery(req.params.id),
        { $set: body },
        { new: true, runValidators: true }
      );
      if (!updatedItem) {
        return res.status(404).json({ error: 'Not Found' });
      }
      res.json(updatedItem);
    } catch (error) {
      console.error(`Error in PATCH /:id for ${Model.modelName}:`, error);
      res.status(500).json({ error: error.message });
    }
  });

  // DELETE item by MongoDB ObjectId or legacy id
  router.delete('/:id', async (req, res) => {
    try {
      const deletedItem = await Model.findOneAndDelete(buildIdQuery(req.params.id));
      if (!deletedItem) {
        return res.status(404).json({ error: 'Not Found' });
      }
      res.json(deletedItem);
    } catch (error) {
      console.error(`Error in DELETE /:id for ${Model.modelName}:`, error);
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};
