# TaskFlow – Task Management Application

A full-stack task management web app built with **React**, **Node.js/Express**, **MongoDB**, and **Socket.io**.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, React Router v6, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (JSON Web Tokens) + bcrypt |
| Real-time | Socket.io (WebSockets) |

---

## Project Structure

```
task-manager/
├── backend/
│   ├── models/
│   │   ├── User.js          # User schema with password hashing
│   │   └── Task.js          # Task schema
│   ├── routes/
│   │   ├── auth.js          # Register, login, /me
│   │   └── tasks.js         # CRUD endpoints
│   ├── middleware/
│   │   └── auth.js          # JWT protect middleware
│   ├── server.js            # Express + Socket.io server
│   ├── .env                 # Environment variables
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── api/
        │   └── index.js     # Axios config + API calls
        ├── context/
        │   └── AuthContext.js  # Global auth state
        ├── components/
        │   ├── TaskCard.js  # Single task row
        │   ├── TaskModal.js # Create/edit form
        │   └── StatsBar.js  # Summary numbers
        ├── pages/
        │   ├── AuthPage.js  # Login / Register
        │   └── Dashboard.js # Main task board
        ├── App.js           # Routes + guards
        └── index.js
```

---

## Step-by-Step Setup

### Step 1 – Prerequisites

Make sure these are installed:
- **Node.js** v18+ → https://nodejs.org
- **MongoDB** (local) → https://www.mongodb.com/try/download/community
  - OR use a free cloud DB: https://www.mongodb.com/atlas (copy the connection URI)

### Step 2 – Clone / Set up the project

```bash
# If you have git, clone it; otherwise just create the folder
mkdir task-manager
cd task-manager
```

Copy all files from this project into the `task-manager/` folder.

### Step 3 – Install backend dependencies

```bash
cd backend
npm install
```

### Step 4 – Configure environment variables

Edit `backend/.env`:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRE=7d
NODE_ENV=development
```

If using MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanager
```

### Step 5 – Start the backend server

```bash
# In the backend/ folder
npm run dev
```

You should see:
```
MongoDB connected
Server running on port 5000
```

### Step 6 – Install frontend dependencies

Open a **new terminal**:

```bash
cd frontend
npm install
```

### Step 7 – Start the React frontend

```bash
npm start
```

The app opens at **http://localhost:3000**

---

## API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/register | Create account | No |
| POST | /api/auth/login | Login, returns JWT | No |
| GET | /api/auth/me | Get current user | Yes |

### Tasks
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/tasks | Get all tasks (filter: ?status=todo&priority=high&search=xyz) | Yes |
| POST | /api/tasks | Create task | Yes |
| GET | /api/tasks/:id | Get single task | Yes |
| PUT | /api/tasks/:id | Update task | Yes |
| DELETE | /api/tasks/:id | Delete task | Yes |
| GET | /api/tasks/stats/summary | Get task counts | Yes |

---

## Features Implemented

- **User authentication** – Register, login, logout with JWT tokens stored in localStorage
- **Protected routes** – Redirect unauthenticated users to login page
- **CRUD operations** – Create, read, update, delete tasks
- **Real-time updates** – Socket.io syncs changes across browser tabs instantly
- **Filtering** – Filter by status (todo / in-progress / done) and priority (high / medium / low)
- **Search** – Live search by task title
- **Overdue detection** – Highlights tasks past their due date
- **Responsive design** – Works on mobile and desktop screens
- **Stats dashboard** – Summary counts for all task statuses

---

## Responsive Design Notes

The layout uses CSS Flexbox and Grid. For mobile screens (< 768px), add this to your CSS:

```css
@media (max-width: 768px) {
  .sidebar { display: none; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .form-row { flex-direction: column; }
}
```

---

## Deployment

### Backend (e.g. Render.com)
1. Push backend folder to GitHub
2. Create a new Web Service on Render
3. Set environment variables in Render dashboard
4. Build command: `npm install`, Start command: `npm start`

### Frontend (e.g. Vercel or Netlify)
1. Push frontend folder to GitHub
2. Connect repo to Vercel/Netlify
3. Set `REACT_APP_API_URL=https://your-backend.onrender.com` in environment variables
4. Update `frontend/src/api/index.js` baseURL to use `process.env.REACT_APP_API_URL`

---

## Common Issues

**MongoDB connection error** → Make sure MongoDB service is running:
```bash
# macOS/Linux
sudo systemctl start mongod
# Windows: start MongoDB from Services
```

**CORS error** → Make sure the frontend runs on port 3000 and backend on 5000.

**Token expired** → Log out and log in again. Token lifespan is set by `JWT_EXPIRE` in `.env`.
