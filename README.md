# Project Tracker 🚀

A modern, full-stack personal Project Tracker built with **Next.js (App Router)** and **MongoDB (Mongoose)** with Tailwind CSS.

Track all your coding projects, repository links, database dashboards, live deployments, and ongoing progress notes in one place.

---

## ✨ Features

- **Project Metadata**:
  - Project Name
  - Small description
  - Status badges: **Active** (with pulsating green indicator), **Inactive**, **On Hold**, **Completed**
  - Tags support (e.g. `#nextjs`, `#mongodb`, `#fullstack`)
- **Branded Links Array**:
  - **GitHub** (repository / org link)
  - **Database Dashboards**: MongoDB, Supabase, Firebase
  - **Live Deployments**: Vercel and custom `.com` / live domain
  - Docs and Custom Links
  - Clickable pill buttons with crisp SVG brand icons that open in new tabs
- **Notes & Progress Updates**:
  - Interactive slide-over drawer for viewing full update history with timestamps
  - Quick note creation directly from the drawer (press Enter to post)
  - Delete individual update notes
- **Search & Filters**:
  - Real-time search across project names, descriptions, and tags
  - Status filter tabs (**All**, **Active**, **Inactive**, **On Hold**, **Completed**)
- **MongoDB Health Indicator**:
  - Visual online/offline status badge in the navbar
  - Graceful connection retry banner with 1-click Docker fallback command

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (React 19, App Router)
- **Database**: MongoDB with Mongoose
- **Styling**: Tailwind CSS
- **Icons**: Custom SVG Brand Icons (GitHub, Supabase, Firebase, MongoDB, Vercel) + Lucide Icons

---

## 🚀 Getting Started

### 1. MongoDB Setup

You can run MongoDB locally using Docker:

```bash
docker compose up -d
```

Or connect to MongoDB Atlas by editing `.env.local`:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/project_tracker?retryWrites=true&w=majority
```

### 2. Start the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### 3. (Optional) Seed Sample Data

To populate sample projects with GitHub, Supabase, and MongoDB links:

```bash
npm run seed
```

---

## 📁 Project Structure

```
├── docker-compose.yml       # Local MongoDB container definition
├── .env.local               # Environment configuration (MONGODB_URI)
├── scripts/
│   └── seed.ts              # Database seeding script
└── src/
    ├── app/
    │   ├── api/
    │   │   ├── health/      # Database connectivity health check
    │   │   └── projects/    # CRUD endpoints for projects & notes
    │   ├── globals.css      # Dark theme & styling
    │   ├── layout.tsx       # Root layout & metadata
    │   └── page.tsx         # Dashboard UI & state management
    ├── components/
    │   ├── Badge.tsx        # Project status badges with live pulsing dots
    │   ├── LinkIcon.tsx     # Custom SVG brand icons (GitHub, MongoDB, Supabase, Firebase, Vercel)
    │   ├── Navbar.tsx       # Top navigation, status indicator, stats
    │   ├── ProjectCard.tsx  # Interactive project card with links and recent note snippet
    │   ├── ProjectModal.tsx # Project creation & editing modal
    │   ├── ProjectDetailDrawer.tsx # Notes/updates timeline drawer & quick note poster
    │   └── DeleteConfirmModal.tsx  # Confirmation dialog for project deletion
    ├── lib/
    │   └── mongodb.ts       # Cached Mongoose connection helper
    └── models/
        └── Project.ts       # Mongoose Schema & TypeScript interfaces
```
