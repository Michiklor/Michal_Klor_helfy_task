# Task Manager App

A fullstack task manager built with React and Express.js.

## Backend Setup

1. cd backend
2. npm install
3. npm run dev (runs on port 4000)

## Frontend Setup

1. cd frontend
2. npm install
3. npm run dev (runs on port 5173 with Vite)

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/tasks | Get all tasks |
| POST | /api/tasks | Create a new task |
| PUT | /api/tasks/:id | Update a task |
| DELETE | /api/tasks/:id | Delete a task |
| PATCH | /api/tasks/:id/toggle | Toggle task completion |

## Task Model

```json
{
  "id": 1,
  "title": "string",
  "description": "string",
  "completed": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "priority": "low | medium | high"
}
```

## Features

- Create, edit and delete tasks
- Mark tasks as completed / incomplete
- Filter tasks by status: All, Pending, Completed
- Endless animated carousel to display tasks
- Priority indication with color badges (High, Medium, Low)
- Form validation with error messages
- Loading and error states

## Design Decisions

- Data is stored in memory on the backend (no database)
- The carousel is built from scratch without any external libraries
- CSS only, no frameworks
- The carousel auto-advances every 3.5 seconds and pauses when the user interacts with a task
