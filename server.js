'use strict';

const { v4: uuidv4 } = require('uuid');

const VALID_STATUSES = ['pending', 'in-progress', 'done'];
const VALID_PRIORITIES = ['low', 'medium', 'high', 'critical'];

class TaskStore {
  constructor() {
    this._tasks = new Map();
  }

  /** new task */
  create({ title, description = '', priority = 'medium', deadline = null, tags = [] }) {
    if (!title || typeof title !== 'string' || title.trim() === '') {
      throw new Error('title is required and must be a non-empty string');
    }
    if (!VALID_PRIORITIES.includes(priority)) {
      throw new Error(`priority must be one of: ${VALID_PRIORITIES.join(', ')}`);
    }
    const task = {
      id: uuidv4(),
      title: title.trim(),
      status: 'pending',
      priority,
      deadline: deadline ? new Date(deadline).toISOString() : null,
      tags: tags.map(t => String(t).toLowerCase().trim()).filter(Boolean),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this._tasks.set(task.id, task);
    return { ...task };
  }


  list({ status, priority, tag, sortBy = 'createdAt', order = 'asc' } = {}) {
    let tasks = Array.from(this._tasks.values());
    if (status) tasks = tasks.filter(t => t.status === status);
    if (priority) tasks = tasks.filter(t => t.priority === priority);
    if (tag) tasks = tasks.filter(t => t.tags.includes(tag.toLowerCase()));
    const W = { low: 1, medium: 2, high: 3, critical: 4 };
    tasks.sort((a, b) => {
      let cmp = sortBy === 'priority' ? W[a.priority] - W[b.priority]
        : sortBy === 'deadline' ? (new Date(a.deadline||'9999') - new Date(b.deadline||'9999'))
        : new Date(a.createdAt) - new Date(b.createdAt);
      return order === 'desc' ? -cmp : cmp;
    });
    return tasks.map(t => ({ ...t }));
  }

  /** Updating task by id */
  update(id, patch) {
    const task = this._tasks.get(id);
    if (!task) throw new Error(`Task not found: ${id}`);
    const allowed = ['title', 'description', 'status', 'priority', 'deadline', 'tags'];
    const unknown = Object.keys(patch).filter(k => !allowed.includes(k));
    if (unknown.length) throw new Error(`Unknown fields: ${unknown.join(', ')}`);
    if ('status' in patch && !VALID_STATUSES.includes(patch.status))
      throw new Error(`status must be one of: ${VALID_STATUSES.join(', ')}`);
    Object.assign(task, patch, { updatedAt: new Date().toISOString() });
    this._tasks.set(id, task);
    return { ...task };
  }
  delete(id) { return this._tasks.delete(id); }

  /** Aggregate stats */
  stats() {
    const counts = { pending: 0, 'in-progress': 0, done: 0, total: 0 };
    for (const t of this._tasks.values()) { counts[t.status]++; counts.total++; }
    counts.overdue = [...this._tasks.values()]
      .filter(t => t.deadline && t.status !== 'done' && new Date(t.deadline) < new Date()).length;
    return counts;
  }
}

module.exports = TaskStore;
