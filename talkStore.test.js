 'use strict';

const TaskStore = require('../src/models/TaskStore');

let store;
beforeEach(() => { store = new TaskStore(); });

describe('TaskStore.create()', () => {
  test('returns a task with all default fields', () => {
    const t = store.create({ title: 'Hello' });
    expect(t.id).toBeDefined();
    expect(t.status).toBe('pending');
    expect(t.priority).toBe('medium');
    expect(t.deadline).toBeNull();
  });

  test('throws if title is missing', () => {
    expect(() => store.create({})).toThrow(/title/);
  });

  test('normalises tags to lowercase and trims', () => {
    const t = store.create({ title: 'T', tags: ['  FOO ', 'Bar', ''] });
    expect(t.tags).toEqual(['foo', 'bar']);
  });
});

describe('TaskStore.stats()', () => {
  test('counts overdue tasks correctly', () => {
    store.create({ title: 'Old', deadline: '2000-01-01T00:00:00.000Z' });
    store.create({ title: 'Future', deadline: '2099-01-01T00:00:00.000Z' });
    expect(store.stats().overdue).toBe(1);
  });
});

// ... 20 more tests