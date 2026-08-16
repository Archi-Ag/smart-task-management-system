# Smart Task Management System — Technical Documentation

## 1. Introduction

Smart Task Management System is a full-stack MERN application designed to help authenticated users organize and track work through tasks and subtasks.

The application combines conventional task-management features with AI assistance, reminders, email notifications, and persistent theme preferences.

The main design goal is to keep the frontend responsible for presentation and user interaction while the backend owns authentication, business rules, data access, AI integration, reminders, and email operations.

---

## 2. Problem and Approach

A basic task application can create and display tasks, but a useful task-management system needs more than CRUD.

The implemented approach addresses this through several layers:

1. Authentication protects user-specific data.
2. REST APIs separate frontend and backend responsibilities.
3. MongoDB stores users and task hierarchies.
4. Task controllers implement CRUD and status rules.
5. Subtask controllers implement child-task operations.
6. AI routes expose AI-powered functionality through the backend.
7. A scheduler handles reminder checks.
8. Nodemailer handles email delivery.
9. The frontend provides responsive task, dashboard, overview, and settings interfaces.
10. `localStorage` is used for client-side persistence such as authentication state and theme preference.

---

## 3. High-Level Architecture

```text
                    ┌────────────────────────────┐
                    │        User / Browser      │
                    └──────────────┬─────────────┘
                                   │
                                   ▼
                    ┌────────────────────────────┐
                    │       React Frontend       │
                    │          Vercel            │
                    │                            │
                    │ Pages + Components         │
                    │ Axios API client            │
                    │ React Router                │
                    │ Theme persistence           │
                    └──────────────┬─────────────┘
                                   │
                              HTTPS / REST
                                   │
                                   ▼
                    ┌────────────────────────────┐
                    │     Express REST API       │
                    │          Render            │
                    │                            │
                    │ Middleware                 │
                    │ Controllers                │
                    │ Routes                     │
                    └──────────────┬─────────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              │                    │                    │
              ▼                    ▼                    ▼
       ┌─────────────┐      ┌─────────────┐     ┌─────────────┐
       │ MongoDB     │      │ AI Service  │     │ Email /     │
       │ Atlas       │      │             │     │ Scheduler   │
       └─────────────┘      └─────────────┘     └─────────────┘
```

---

## 4. Frontend Architecture

The frontend is implemented using React.

### Responsibilities

The frontend handles:

- Page rendering.
- User interaction.
- Navigation.
- Form input.
- Task display.
- Search/filter controls.
- Subtask controls.
- Settings.
- Theme switching.
- API communication.

### Main areas

```text
frontend/src/
├── components/
│   ├── dashboard/
│   └── layout/
├── pages/
├── services/
│   ├── api.js
│   └── taskService.js
└── styles/
```

The exact component list may grow as the application evolves.

### API client

`frontend/src/services/api.js` creates the Axios instance.

The deployed API base URL is:

```text
https://smart-task-management-api-v9fl.onrender.com/api
```

The Axios request interceptor reads the token from `localStorage` and sends it as:

```text
Authorization: Bearer <token>
```

---

## 5. Backend Architecture

The backend uses Node.js and Express.

### Request flow

```text
HTTP Request
     |
     v
Express
     |
     v
CORS / JSON middleware
     |
     v
Route
     |
     v
Authentication middleware
     |
     v
Controller
     |
     v
Mongoose Model
     |
     v
MongoDB Atlas
     |
     v
JSON Response
```

### Backend modules

```text
backend/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── services/
└── server.js
```

---

## 6. Authentication Design

Authentication uses JWT.

### Registration

```text
User enters registration details
          |
          v
POST /api/auth/register
          |
          v
Validate request
          |
          v
Hash password with bcrypt
          |
          v
Create user
          |
          v
Return authentication response
```

### Login

```text
User enters credentials
          |
          v
POST /api/auth/login
          |
          v
Find user
          |
          v
Compare password with bcrypt
          |
          v
Create JWT
          |
          v
Frontend stores token
```

### Protected request

```text
Frontend
   |
   | Authorization: Bearer JWT
   v
authMiddleware
   |
   +-- valid --> Controller
   |
   +-- invalid --> 401 response
```

---

## 7. Data Model

The main task model contains:

- `title`
- `description`
- `status`
- `priority`
- `category`
- `dueDate`
- `dueTime`
- `reminderSent`
- `subtasks`
- `user`
- timestamps

### Status

```text
Pending
Completed
```

### Priority

```text
Low
Medium
High
```

### Subtask structure

Each subtask contains:

```text
title
completed
_id
```

A task belongs to one authenticated user.

---

## 8. Task Management

The task controller implements:

- Create task.
- Get all tasks.
- Get one task.
- Update task.
- Delete task.
- Toggle task status.

### Filtering

The task listing API supports:

```text
search
status
priority
category
```

Search checks both:

```text
title
description
```

The backend performs filtering before returning the task list.

---

## 9. Subtask Management

Subtasks are embedded inside the parent task document.

Available operations:

```text
POST   /api/subtasks/:taskId
PATCH  /api/subtasks/:taskId/:subtaskId
PATCH  /api/subtasks/:taskId/:subtaskId/edit
DELETE /api/subtasks/:taskId/:subtaskId
```

The exact route behavior should be kept aligned with the current route/controller implementation.

### Completion rule

The system implements a parent-child synchronization rule:

```text
If parent is completed
        ↓
all subtasks become completed
```

and:

```text
If subtasks exist AND every subtask is completed
        ↓
parent becomes completed
```

This prevents inconsistent states such as a completed parent with incomplete children or an incomplete parent when every child has already been completed.

---

## 10. AI Features

The backend exposes AI functionality through dedicated routes.

The frontend can use AI assistance for task-related functionality such as:

- Generating task titles/descriptions.
- Producing task summaries.

The AI integration is intentionally kept on the backend so private API credentials are not exposed in browser code.

```text
React
  |
  | AI request
  v
/api/ai
  |
  v
Backend AI integration
  |
  v
AI provider
  |
  v
Generated result
  |
  v
React
```

---

## 11. Reminder and Email Architecture

The backend includes a reminder scheduler using `node-cron`.

The scheduler runs as part of the backend process.

```text
Node server starts
       |
       v
startReminderScheduler()
       |
       v
Periodic task check
       |
       v
Find eligible pending tasks
       |
       v
Reminder required?
     /     \
   No       Yes
   |         |
   |         v
   |      Nodemailer
   |         |
   |         v
   |      Email sent
   |         |
   |         v
   |   reminderSent=true
   |
   v
Continue
```

The `reminderSent` flag prevents repeated notification behavior for the same reminder cycle.

---

## 12. Theme Persistence

The theme toggle uses browser `localStorage`.

At initialization:

```text
localStorage.theme
      |
      +-- "dark"  → dark mode
      |
      +-- otherwise → light mode
```

When the user switches mode:

```text
React state changes
      |
      v
body.dark-mode toggled
      |
      v
localStorage updated
```

This allows the preference to survive a page refresh.

---

## 13. Settings

The Settings page provides an application settings area and includes appearance controls and reminder-related settings.

The sidebar provides navigation between major application areas.

The Settings UI is designed so additional preferences can be added without changing the overall application architecture.

---

## 14. Error Handling

Controllers use `try/catch` blocks and return HTTP status codes with JSON messages.

Common responses include:

```text
400 — Invalid request
401 — Unauthorized
404 — Resource not found
500 — Server error
```

The frontend can use these responses to display appropriate error messages.

---

## 15. Security Considerations

### Passwords

Passwords are hashed using bcrypt before storage.

### Authentication

JWT protects authenticated routes.

### Secrets

Private credentials should be stored in environment variables.

### CORS

Production CORS should allow only trusted frontend origins.

### Database

MongoDB Atlas credentials should never be committed to source control.

### AI keys

AI provider keys must remain on the backend.

---

## 16. Deployment Architecture

```text
GitHub Repository
        |
        ├───────────────┐
        │               │
        ▼               ▼
     Vercel           Render
   Frontend          Backend API
        │               │
        │               ├── MongoDB Atlas
        │               ├── AI provider
        │               └── Email provider
        │
        └──── HTTPS ────► Render API
```

### Frontend

The React/Vite frontend is deployed through Vercel.

Recommended Vercel settings:

```text
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
```

### Backend

The Express backend is deployed through Render.

Recommended settings:

```text
Root Directory: backend
Build Command: npm install
Start Command: node server.js
```

---

## 17. Local Development

### Backend

```bash
cd backend
npm install
node server.js
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend communicates with the backend through the Axios API client.

---

## 18. Deployment Troubleshooting

### `Cannot GET /api`

This does not necessarily mean the backend is broken.

The current Express server defines:

```text
/
```

and resource routes such as:

```text
/api/auth
/api/tasks
/api/subtasks
/api/users
/api/ai
/api/email
```

There is no generic `GET /api` route unless one is explicitly added.

### Vercel `404 NOT_FOUND`

Check:

1. The Vercel project is connected to the correct repository.
2. Root Directory is `frontend`.
3. Build command is `npm run build`.
4. Output directory is `dist`.
5. The build produces `dist/index.html`.
6. SPA routing is configured if direct navigation to React routes is required.
7. The deployed frontend is using the Render API rather than a Codespaces URL.

### CORS errors

Ensure the Render backend allows the exact Vercel frontend origin.

Do not keep obsolete GitHub Codespaces origins in production configuration unless they are intentionally required.

---

## 19. Testing Strategy

### Functional testing

Test:

- Authentication.
- Task CRUD.
- Search.
- Filters.
- Task completion.
- Subtask CRUD.
- Parent/subtask synchronization.
- AI features.
- Reminders.
- Email.
- Settings.
- Theme persistence.
- Logout.

### Deployment testing

Test the deployed frontend against the deployed backend, not only the local development environment.

---

## 20. Design Decisions

### Why REST API?

REST provides a clear separation between frontend presentation and backend business logic.

### Why MongoDB?

Tasks naturally contain embedded subtasks, making a document-oriented database a suitable fit for the application's task hierarchy.

### Why JWT?

JWT provides stateless authentication for API requests.

### Why keep AI on the backend?

It prevents private AI credentials from being exposed to the browser.

### Why use `localStorage` for theme?

Theme preference is a client-side UI preference and does not require a database round trip.

---

## 21. Future Improvements

Potential future work includes:

- Automated test suite.
- CI/CD checks.
- Role-based access.
- Recurring tasks.
- Calendar integration.
- Advanced reminder rules.
- Task labels/tags.
- Activity history.
- Better analytics.
- Custom production domain.
- Centralized environment configuration for frontend API URL.
