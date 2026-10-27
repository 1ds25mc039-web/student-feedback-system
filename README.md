# Student Feedback System

An online feedback prototype where students rate courses and leave comments, and faculty/admin can review the results.

## Tech Stack
- Frontend: React JS (Vite)
- Backend: Node.js + Express.js
- Database: MongoDB (Mongoose)
- Authentication: JWT + bcrypt

## Features
- Student registration and login
- Course selection
- Feedback form with rating (1-5) and comments
- One feedback per student per course
- Faculty/admin dashboard with average rating per course and a course filter

## How to Run

### Backend
```
cd backend
npm install
npm run dev
```
Create a `.env` file in `backend` (see `.env.example`) with `PORT`, `MONGO_URI` and `JWT_SECRET`.

### Frontend
```
cd frontend
npm install
npm run dev
```
Open http://localhost:5173

## API Endpoints
| Method | Endpoint | Access |
|---|---|---|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET | /api/courses | Logged in |
| POST | /api/feedback | Student |
| GET | /api/feedback | Faculty/Admin |

## Author
1DS25MC039, Department of MCA, DSCE