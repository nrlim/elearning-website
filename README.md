# 🎓 CryptoLearn - YouTube E-Learning Platform

A **fullstack e-learning platform** built with Next.js 16, featuring **role-based authentication**, **YouTube video integration**, and a **modern crypto-inspired UI**.

## ✨ Features

### 👤 User Features
- ✅ Register & Login with email/password
- ✅ Browse learning content in a grid view
- ✅ Watch embedded YouTube videos
- ✅ Responsive modern UI with dark mode

### 🛠 Admin Features
- ✅ Full CRUD for Users (Edit roles, Delete users)
- ✅ Full CRUD for Content (Create, Edit, Delete learning modules)
- ✅ Assign YouTube URLs to learning modules
- ✅ Dedicated admin panel with tabs

---

## 🚀 Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16 (App Router, TypeScript) |
| **Database** | PostgreSQL (Supabase) |
| **ORM** | Prisma |
| **Auth** | NextAuth.js v4 (Credentials Provider) |
| **UI** | TailwindCSS + Shadcn/ui |
| **Validation** | React Hook Form + Zod |
| **Video** | YouTube IFrame API |

---

## 📦 Installation & Setup

### 1️⃣ Clone & Install Dependencies

```bash
npm install
```

### 2️⃣ Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase PostgreSQL Database
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"

# NextAuth
NEXTAUTH_SECRET="your-super-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

**To generate `NEXTAUTH_SECRET`:**
```bash
openssl rand -base64 32
```

### 3️⃣ Set Up Supabase Database

1. Go to [Supabase](https://supabase.com) and create a new project
2. Get your database connection strings from **Project Settings > Database**
3. Replace `[PASSWORD]` and `[PROJECT_REF]` in your `.env` file

### 4️⃣ Push Database Schema

```bash
npx prisma db push
```

This will create the `User` and `Content` tables in your Supabase database.

### 5️⃣ Generate Prisma Client

```bash
npx prisma generate
```

### 6️⃣ Run Development Server

```bash
npm run dev
```

Visit **http://localhost:3000** 🎉

---

## 🗄️ Database Schema

```prisma
model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String   // bcrypt hashed
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
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/          # Login page
│   │   └── register/       # Registration page
│   ├── admin/              # Admin dashboard
│   ├── content/[id]/       # Content detail page with video player
│   ├── dashboard/          # User dashboard
│   ├── api/
│   │   ├── auth/           # NextAuth endpoints
│   │   ├── content/        # Content CRUD APIs
│   │   ├── users/          # User management APIs
│   │   └── register/       # User registration
│   ├── layout.tsx
│   └── page.tsx            # Landing page
├── components/
│   ├── admin/
│   │   ├── content-management.tsx
│   │   └── user-management.tsx
│   ├── ui/                 # Shadcn components
│   ├── navbar.tsx
│   ├── providers.tsx
│   ├── theme-provider.tsx
│   └── youtube-player.tsx
├── lib/
│   ├── auth.ts             # NextAuth config
│   ├── prisma.ts           # Prisma client
│   ├── utils.ts
│   └── youtube.ts          # YouTube URL utilities
└── middleware.ts           # Route protection
```

---

## 🔐 Creating an Admin User

By default, all registered users have the `USER` role. To create an admin:

### Option 1: Via Supabase Dashboard
1. Go to **Supabase Dashboard > Table Editor > User**
2. Find your user and change `role` from `USER` to `ADMIN`

### Option 2: Via Prisma Studio
```bash
npx prisma studio
```
Open the `User` table and edit the role.

---

## 🎬 YouTube URL Formats

The platform supports all standard YouTube URL formats:

- ✅ `https://www.youtube.com/watch?v=VIDEO_ID`
- ✅ `https://youtu.be/VIDEO_ID`
- ✅ `https://www.youtube.com/embed/VIDEO_ID`

---

## 🛡️ Security Features

- ✅ Password hashing with **bcrypt**
- ✅ JWT-based session management
- ✅ Route protection with **middleware**
- ✅ Server-side role validation
- ✅ Input validation with **Zod**
- ✅ Protected API routes

---

## 📱 Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Landing page |
| `/login` | Public | Login page |
| `/register` | Public | Registration page |
| `/dashboard` | Authenticated | User dashboard with content grid |
| `/content/:id` | Authenticated | Watch video page |
| `/admin` | Admin Only | Admin panel (Users + Content tabs) |

---

## 🎨 Design Philosophy

- **Modern & Minimal**: Clean, professional UI with subtle animations
- **Crypto-Inspired**: Dark violet color scheme with gradient accents
- **Mobile-First**: Fully responsive across all devices
- **Elegant**: Simple, not cluttered—premium feel without excess

---

## 🚦 Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

npx prisma studio    # Open Prisma database GUI
npx prisma db push   # Sync schema to database
npx prisma generate  # Generate Prisma client
```

---

## 📝 License

Built by **Antigravity** for educational purposes.

---

## 🐛 Troubleshooting

### Database Connection Issues
- Verify your Supabase credentials in `.env`
- Ensure your IP is allowed in Supabase settings
- Use `DIRECT_URL` for migrations and `DATABASE_URL` for queries

### NextAuth Errors
- Ensure `NEXTAUTH_SECRET` is set
- Check that `NEXTAUTH_URL` matches your domain

### Build Errors
- Run `npm install --legacy-peer-deps` if dependency conflicts occur
- Clear `.next` folder: `rm -rf .next` (or `rd /s /q .next` on Windows)

---

**Happy Learning! 🚀**
