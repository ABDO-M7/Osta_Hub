# EdTech SaaS Platform

A production-ready EdTech platform with interactive block-based lessons, timed exams, AI-powered essay grading, and role-based dashboards.

## Features

- **Auth**: JWT Authentication, Role-based Access (Admin / Student)
- **Lessons**: Block-based dynamic content editor (Paragraphs, Images, Interactive Graphs, Quizzes)
- **Exams**: Timed exams with MCQ, True/False, and Essay tracking
- **AI Grading**: Auto-grades essays using Hugging Face's Free Inference API.
- **Dashboards**: Dedicated tracking for students, and comprehensive platform management for admins.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS, ShadCN UI, Zustand, Axios
- **Backend**: NestJS, TypeScript, Clean Architecture
- **Database**: PostgreSQL setup with Prisma ORM

---

## Getting Started (Local Development)

### 1. Database Setup
Ensure you have PostgreSQL running, or use the provided docker-compose file just for the DB:
```bash
docker-compose up db -d
```

### 2. Backend Setup
1. CD into the directory: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example`.
4. Run migrations: `npx prisma db push` (or `npx prisma migrate dev`)
5. Seed initial data (optional but recommended): `npx prisma db seed`
6. Start dev server: `npm run start:dev`

**Note on AI Grading**: To enable real AI essay grading, get a free token from Hugging Face and add `HF_API_TOKEN=your_token` to your backend `.env` file. Without it, the backend uses a fallback heuristic grader.

### 3. Frontend Setup
1. CD into the directory: `cd frontend`
2. Install dependencies: `npm install`
3. Create a `.env` file containing `NEXT_PUBLIC_API_URL=http://localhost:4000/api`
4. Start dev server: `npm run dev`

### 4. Logging In
If you ran the seed script, you can use these test accounts:
- **Admin**: `admin@edtech.com` / `admin123`
- **Student**: `student@edtech.com` / `student123`

---

## Production Deployment (Docker)

To run the entire stack (Database, Backend, Frontend) via Docker:

1. Ensure `.env` is setup in the backend.
2. From the root directory run:
```bash
docker-compose up --build -d
```
3. The app will be available at `http://localhost:3000`.

*Note: For production, you would typically deploy the frontend to Vercel/Netlify for better edge performance, and host the NestJS backend + Postgres on Render, Railway, or AWS.*
