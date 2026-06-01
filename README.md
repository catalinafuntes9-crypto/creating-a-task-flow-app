# TaskFlow API

A task management REST API built with Node.js and Express.

## Features

- Full CRUD for tasks
- Status lifecycle: pending → in-progress → done
- Priority levels: low, medium, high, critical
- ISO 8601 deadline support with overdue detection
- Tag-based filtering (normalised to lowercase)
- Sortable task lists (by createdAt, priority, deadline)
- Aggregate stats endpoint
- 65 integration + unit tests via Jest

## Quick start

```bash
npm install
npm start       # runs on port 3000
npm test        # run all 65 tests
```
