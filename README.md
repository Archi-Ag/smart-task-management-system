# Smart Task Management System

A full-stack task management application built with the MERN stack. The system allows authenticated users to create, manage, search, filter, complete, and delete tasks, while also supporting subtasks, AI-assisted task generation/summary features, reminders, email notifications, theme persistence, and a dedicated settings area.

## Live Application

- Frontend: https://smart-task-management-system-h88wz6rch-archi-ags-projects.vercel.app/
- Backend API: https://smart-task-management-api-v9fl.onrender.com/

> Deployment URLs can change if the hosting provider creates a new deployment URL.

## Key Features

### Authentication
- User registration and login.
- JWT-based authentication.
- Password hashing with bcrypt.
- Protected task and user APIs.

### Task Management
- Create tasks.
- View tasks.
- Edit tasks.
- Delete tasks.
- Toggle Pending/Completed status.
- Search tasks by title or description.
- Filter by status, priority, and category.
- Due date and due time support.
- Priority levels: Low, Medium, High.
- Categories.

### Subtasks
- Add subtasks to a parent task.
- Edit subtasks.
- Delete subtasks.
- Toggle subtask completion.
- If every subtask is completed, the parent task is completed automatically.
- If a parent task is completed, all of its subtasks are completed.

### AI Features
- AI-assisted task generation.
- AI-assisted task summary functionality.

### Reminders and Email
- Reminder scheduling using `node-cron`.
- Email functionality using Nodemailer.
- Reminder state tracking through `reminderSent`.

### UI and Settings
- Responsive dashboard.
- Sidebar navigation.
- Settings page.
- Light/dark theme toggle.
- Theme preference is persisted in `localStorage`.
- Mobile-friendly task actions and layouts.

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React |
| Routing | React Router |
| HTTP Client | Axios |
| Backend | Node.js + Express |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Authentication | JWT |
| Password Security | bcryptjs |
| AI | AI service integrated through backend |
| Email | Nodemailer |
| Scheduling | node-cron |
| Styling | CSS |
| Frontend Deployment | Vercel |
| Backend Deployment | Render |
| Source Control | GitHub |

## Project Structure

```text
smart-task-management-system/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── taskController.js
│   │   └── subtaskController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── taskRoutes.js
│   │   ├── subtaskRoutes.js
│   │   ├── aiRoutes.js
│   │   ├── emailRoutes.js
│   │   └── userRoutes.js
│   ├── services/
│   │   └── reminderScheduler.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── taskService.js
│   │   └── styles/
│   ├── package.json
│   └── ...
│
├── README.md
├── DOCUMENTATION.md
└── architecture.mmd
```

## Architecture

```text
React Frontend (Vercel)
        |
        | HTTPS / Axios REST API
        v
Node.js + Express Backend (Render)
        |
        +--> JWT Authentication
        |
        +--> Task APIs
        |
        +--> Subtask APIs
        |
        +--> AI APIs
        |
        +--> Email APIs
        |
        +--> Reminder Scheduler
        |
        v
MongoDB Atlas
```

The detailed architecture is available in `architecture.mmd`.

## API Base URL

The frontend uses the deployed backend API:

```text
https://smart-task-management-api-v9fl.onrender.com/api
```

The Axios client adds the JWT token from `localStorage` to authenticated requests.

## Environment Variables

Do not commit secrets to GitHub.

### Backend

Typical backend environment variables include:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_ai_api_key
EMAIL_USER=your_email
EMAIL_PASS=your_email_password_or_app_password
```

Use the exact variable names already expected by your backend code.

### Frontend

If environment variables are introduced for the API URL, use a Vite variable such as:

```env
VITE_API_URL=https://smart-task-management-api-v9fl.onrender.com/api
```

Do not put private API keys in the frontend.

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/Archi-Ag/smart-task-management-system.git
cd smart-task-management-system
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Configure backend environment variables

Create:

```text
backend/.env
```

Add the required MongoDB, JWT, AI, email, and port settings.

### 4. Start the backend

```bash
node server.js
```

For development with Nodemon:

```bash
npx nodemon server.js
```

The backend normally runs on:

```text
http://localhost:5000
```

### 5. Install frontend dependencies

Open another terminal:

```bash
cd frontend
npm install
```

### 6. Start the frontend

```bash
npm run dev
```

The Vite development server normally runs on:

```text
http://localhost:5173
```

## Authentication Flow

```text
User
 |
 | Register/Login
 v
React Frontend
 |
 | POST /api/auth/...
 v
Express Auth Route
 |
 v
Auth Controller
 |
 +--> bcrypt password verification
 |
 +--> JWT creation
 |
 v
Frontend stores JWT
 |
 | Authorization: Bearer <token>
 v
Protected API routes
```

## Task and Subtask Completion Logic

The application uses a parent-child completion relationship.

### Subtasks complete the parent

```text
Parent Task
   |
   +-- Subtask 1 ✓
   +-- Subtask 2 ✓
   +-- Subtask 3 ✓
   |
   +--> Parent Task = Completed
```

### Parent completion completes subtasks

```text
Parent Task = Completed
        |
        +--> Subtask 1 = Completed
        +--> Subtask 2 = Completed
        +--> Subtask 3 = Completed
```

This keeps the task hierarchy consistent.

## Reminder Flow

```text
Task has due date/time
        |
        v
Reminder Scheduler
(node-cron)
        |
        v
Check pending tasks
        |
        v
Reminder condition met?
      /     \
    No       Yes
    |         |
    |         v
    |     Send email
    |         |
    |         v
    |   reminderSent = true
    |
    v
Continue scheduler
```

## Deployment

### Frontend — Vercel

Configure the Vercel project so the frontend directory is the project root:

```text
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
```

### Backend — Render

Configure the Render web service to use the backend directory and start the Express server:

```text
Root Directory: backend
Build Command: npm install
Start Command: node server.js
```

Set all required secrets in Render Environment Variables.

### CORS

The backend must allow the deployed frontend origin.

For production, configure CORS with the actual Vercel production URL rather than an old GitHub Codespaces URL.

## Testing Checklist

- [ ] Register a new user.
- [ ] Log in.
- [ ] Create a task.
- [ ] Edit a task.
- [ ] Delete a task.
- [ ] Search tasks.
- [ ] Filter tasks.
- [ ] Toggle task completion.
- [ ] Add a subtask.
- [ ] Edit a subtask.
- [ ] Delete a subtask.
- [ ] Complete all subtasks and verify parent completion.
- [ ] Complete a parent task and verify all subtasks complete.
- [ ] Test AI task generation.
- [ ] Test AI summary.
- [ ] Test reminder settings.
- [ ] Test theme persistence after refresh.
- [ ] Test logout.
- [ ] Test responsive/mobile layout.
- [ ] Test deployed frontend against deployed backend.

## Security Notes

- Never commit `.env` files.
- Never expose AI or database credentials in React code.
- Use JWT for protected API requests.
- Hash passwords before storing them.
- Restrict MongoDB access appropriately.
- Configure production CORS to trusted frontend origins.
- Use HTTPS for deployed services.

## Future Improvements

- Role-based access control.
- More advanced recurring reminders.
- Calendar integration.
- Drag-and-drop task ordering.
- Task labels/tags.
- Activity history.
- More granular notification preferences.
- Automated unit and integration tests.
- CI/CD pipeline.
- Custom production domain.

## Author

**Archi-Ag**

GitHub: https://github.com/Archi-Ag/smart-task-management-system
