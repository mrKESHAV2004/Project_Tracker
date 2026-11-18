import mongoose from "mongoose";
import { Project } from "../src/models/Project";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/project_tracker";

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB for seeding...");

  const existing = await Project.countDocuments();
  if (existing > 0) {
    console.log(`Found ${existing} existing projects. Skipping seed.`);
    await mongoose.disconnect();
    return;
  }

  await Project.create([
    {
      name: "Project Tracker",
      description: "Personal dashboard for tracking all my projects, databases, repositories, live URLs, and release updates.",
      status: "active",
      tags: ["nextjs", "mongodb", "tailwind", "typescript"],
      links: [
        {
          type: "github",
          label: "GitHub Repo",
          url: "https://github.com",
        },
        {
          type: "mongodb",
          label: "MongoDB Local",
          url: "mongodb://127.0.0.1:27017/project_tracker",
        },
        {
          type: "vercel",
          label: "Vercel Deploy",
          url: "https://vercel.com",
        },
        {
          type: "live",
          label: "projecttracker.com",
          url: "https://example.com",
        },
      ],
      notes: [
        {
          content: "Initial release with MongoDB database connection, project cards, and link icons.",
          createdAt: new Date(),
        },
        {
          content: "Created Docker Compose setup for local development.",
          createdAt: new Date(Date.now() - 3600000),
        },
      ],
    },
    {
      name: "E-Commerce SaaS API",
      description: "Backend services for payment processing and store sync using Supabase PostgreSQL.",
      status: "active",
      tags: ["supabase", "stripe", "api"],
      links: [
        {
          type: "github",
          label: "API Source",
          url: "https://github.com",
        },
        {
          type: "supabase",
          label: "Supabase DB",
          url: "https://supabase.com/dashboard",
        },
        {
          type: "live",
          label: "api.store.com",
          url: "https://example.com",
        },
      ],
      notes: [
        {
          content: "Integrated webhooks and customer payment receipts.",
          createdAt: new Date(Date.now() - 86400000),
        },
      ],
    },
  ]);

  console.log("Seeding complete!");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
