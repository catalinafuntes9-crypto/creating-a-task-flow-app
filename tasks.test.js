 'use strict';

const request = require('supertest');
const createApp = require('../src/app');
const TaskStore = require('../src/models/TaskStore');

function freshApp() {
  const store = new TaskStore();
  return { store, app: createApp(store) };
}

describe('POST /tasks', () => {
  test('creates a task with required fields only', async () => {
    const { app } = freshApp();
    const res = await request(app).post('/tasks').send({ title: 'Write tests' });
    expect(res.status).toBe(201);
    expect(res.body.data.status).toBe('pending');
    expect(res.body.data.priority).toBe('medium');
  });

  test('returns 400 if title is missing', async () => {
    const { app } = freshApp();
    const res = await request(app).post('/tasks').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/title/i);
  });

  test('returns 400 for invalid priority', async () => {
    const { app } = freshApp();
    const res = await request(app).post('/tasks').send({ title: 'T', priority: 'urgent' });
    expect(res.status).toBe(400);
  });
});

describe('GET /tasks', () => {
  test('sorts by priority descending', async () => {
    const { app } = freshApp();
    await request(app).post('/tasks').send({ title: 'A', priority: 'low' });
    await request(app).post('/tasks').send({ title: 'B', priority: 'critical' });
    const res = await request(app).get('/tasks?sortBy=priority&order=desc');
    expect(res.body.data.map(t => t.priority)).toEqual(['critical', 'low']);
  });
});

describe('DELETE /tasks/:id', () => {
  test('deletes task and returns 204', async () => {
    const { app } = freshApp();
    const r = await request(app).post('/tasks').send({ title: 'Bye' });
    const del = await request(app).delete(`/tasks/${r.body.data.id}`);
    expect(del.status).toBe(204);
  });
});

