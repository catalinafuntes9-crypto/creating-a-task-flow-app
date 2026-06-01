'use strict';

const express = require('express');
const TaskStore = require('./models/TaskStore');
const createTaskRouter = require('./routes/tasks');

function createApp(store = new TaskStore()) {
  const app = express();

  app.use(express.json());

  //  check the health.
  app.get('/health', (req, res) => res.json({ status: 'ok' }));

  // Task routes
  app.use('/tasks', createTaskRouter(store));

  // 404 fallback
  app.use((req, res) => res.status(404).json({ error: 'Not found' }));

  // Error handler
  app.use((err, req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}

module.exports = createApp;