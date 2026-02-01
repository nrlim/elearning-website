# 🎓 YouTube E-Learning Platform (Fullstack Next.js)

## Objective
Build a **fullstack e-learning website** where learning content is delivered using **embedded YouTube videos**.  
The platform must support **User & Admin roles** with authentication, content management, and a responsive modern UI.

> **Design Reference:**  
> UI/UX must be inspired by https://akademicrypto.com  
> (visual style & interaction only, no asset copying)

---

## Tech Stack (Mandatory)

- Frontend: Next.js (App Router, TypeScript)
- Backend: Next.js API Routes
- Database: PostgreSQL
- ORM: Prisma
- Auth: Supabase Auth / NextAuth
- Database Host: Supabase
- Styling: TailwindCSS
- UI Components: shadcn/ui
- Validation: React Hook Form + Zod
- Video: YouTube IFrame API

---

## User Roles & Features

### 👤 User
- Login
- Logout
- View learning content
- Watch embedded YouTube videos

### 🛠 Admin
- Manage Users (CRUD)
- Manage Learning Content (CRUD)
- Assign YouTube URLs to learning modules

---

## Database Schema (Prisma)

```prisma
model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String
  role      Role     @default(USER)
  createdAt DateTime @default(now())
}

model Content {
  id          String   @id @default(uuid())
  title       String
  description String
  youtubeUrl  String
  createdAt   DateTime @default(now())
}

enum Role {
  USER
  ADMIN
}
