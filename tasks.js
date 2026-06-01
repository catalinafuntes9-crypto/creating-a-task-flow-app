 'use strict';

const express = require('express');

module.exports = function createTaskRouter(store) {
  const router = express.Router();

  // POST /tasks
  router.post('/', (req, res) => {
    try {
      const task = store.create(req.body);
      return res.status(201).json({ data: task });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  });

  // GET /tasks
  router.get('/', (req, res) => {
    try {
      const { status, priority, tag, sortBy, order } = req.query;
      const tasks = store.list({ status, priority, tag, sortBy, order });
      return res.json({ data: tasks, count: tasks.length });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  });

  // GET /tasks/stats
  router.get('/stats', (req, res) => {
    return res.json({ data: store.stats() });
  });

  // GET /tasks/:id
  router.get('/:id', (req, res) => {
    const task = store.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    return res.json({ data: task });
  });

  // PATCH /tasks/:id
  router.patch('/:id', (req, res) => {
    try {
      const task = store.update(req.params.id, req.body);
      return res.json({ data: task });
    } catch (err) {
      if (err.message.startsWith('Task not found'))
        return res.status(404).json({ error: err.message });
      return res.status(400).json({ error: err.message });
    }
  });

  // DELETE /tasks/:id
  router.delete('/:id', (req, res) => {
    const deleted = store.delete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Task not found' });
    return res.status(204).send();
  });

  return router;
};s