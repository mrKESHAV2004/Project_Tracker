import mongoose from "mongoose";
import fs from "fs";
import { Project, IProjectLink, IProjectNote, LinkType, ProjectStatus } from "../src/models/Project";

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://shrimalikeshav4_db_user:f7yc666i9MUWPppa@cluster0.1jgcpxz.mongodb.net/project_tracker?retryWrites=true&w=majority";

// Metadata dictionary for rich project context
const REPO_METADATA: Record<
  string,
  {
    description: string;
    tags: string[];
    status?: ProjectStatus;
    customLinks?: { type: LinkType; label: string; url: string }[];
  }
> = {
  oneOfVarn: {
    description: "Fullstack art and creator platform with admin portal, commerce, and Supabase auth.",
    tags: ["mongodb", "supabase", "nextjs", "fullstack", "ecommerce"],
    status: "active",
    customLinks: [
      {
        type: "mongodb",
        label: "Atlas (oneofvarn)",
        url: "https://cloud.mongodb.com",
      },
      {
        type: "supabase",
        label: "Supabase DB",
        url: "https://hvejjrfqyhgenapiecav.supabase.co",
      },
      {
        type: "vercel",
        label: "Vercel Deployment",
        url: "https://oneofvarn.vercel.app",
      },
    ],
  },
  GamingEngine: {
    description: "C++ Game Engine architecture with local asset & scene file I/O and UE5 scalability matrix.",
    tags: ["cpp", "game-engine", "ue5", "graphics"],
    status: "active",
  },
  PORTFOLIO_MAIN: {
    description: "Personal developer portfolio website built with React, Vite, and modern animations.",
    tags: ["react", "vite", "portfolio", "frontend"],
    status: "active",
    customLinks: [
      {
        type: "live",
        label: "Live Portfolio",
        url: "https://mrkeshav2004.github.io",
      },
    ],
  },
  "game-engine": {
    description: "Game engine prototype featuring Azure cloud telemetry and rendering components.",
    tags: ["game-engine", "azure", "telemetry", "cpp"],
    status: "active",
  },
  stocks: {
    description: "Quantitative financial stock analysis tool with React frontend and local Python scripts.",
    tags: ["react", "python", "finance", "quant"],
    status: "active",
  },
  AnalyticsDashboard: {
    description: "Analytics and telemetry dashboard repository for cross-platform event metrics.",
    tags: ["analytics", "dashboard", "typescript"],
    status: "active",
  },
  Empire_greens: {
    description: "Next.js & TypeScript web application with Vercel serverless deployment setup.",
    tags: ["nextjs", "typescript", "vercel", "fullstack"],
    status: "active",
    customLinks: [
      {
        type: "vercel",
        label: "Vercel Deploy",
        url: "https://vercel.com",
      },
    ],
  },
  obsidian: {
    description: "Vite and React web productivity tool and note visualization utility.",
    tags: ["vite", "react", "tools", "productivity"],
    status: "active",
  },
  Karkhana: {
    description: "Management portal and storefront integrated with Firebase Firestore and Razorpay payments.",
    tags: ["firebase", "razorpay", "react", "payments"],
    status: "active",
    customLinks: [
      {
        type: "firebase",
        label: "Firebase Console",
        url: "https://console.firebase.google.com",
      },
    ],
  },
  anantkaal: {
    description: "Fullstack web application powered by Supabase PostgreSQL backend database.",
    tags: ["supabase", "postgresql", "fullstack", "react"],
    status: "active",
    customLinks: [
      {
        type: "supabase",
        label: "Supabase DB",
        url: "https://xhtcfmugmgirrxszlwml.supabase.co",
      },
    ],
  },
  shreechemtrade: {
    description: "Client business website and product catalog with responsive UI styling.",
    tags: ["client-project", "web", "frontend", "responsive"],
    status: "active",
  },
  Lakadwala: {
    description: "Custom woodworking and furniture showcase site with contact and inquiry forms.",
    tags: ["client-project", "web", "frontend"],
    status: "active",
  },
  "Autonomous-FinOps": {
    description: "Python FinOps automation CLI tool for cloud infrastructure cost optimization.",
    tags: ["python", "finops", "cloud", "cli"],
    status: "active",
  },
  mrKESHAV2004: {
    description: "GitHub Profile dynamic README and personal project showcase configuration.",
    tags: ["github", "profile", "markdown"],
    status: "active",
  },
  LMS_PORTAL: {
    description: "College Learning Management System with Firebase Firestore (`lms-college-44124`) and Auth.",
    tags: ["firebase", "react", "lms", "education"],
    status: "active",
    customLinks: [
      {
        type: "firebase",
        label: "Firebase (lms-college)",
        url: "https://console.firebase.google.com",
      },
    ],
  },
  "Orbia-main": {
    description: "Interactive 3D web experience developed with Three.js and modern WebGL shaders.",
    tags: ["threejs", "javascript", "3d", "webgl"],
    status: "active",
  },
  Crimson: {
    description: "Machine learning research exploring variable algorithm hyperparameters in Python.",
    tags: ["python", "machine-learning", "algorithms"],
    status: "active",
  },
  Culthouse: {
    description: "Community and events platform featuring Firebase Firestore backend and authentication.",
    tags: ["firebase", "react", "community", "events"],
    status: "active",
    customLinks: [
      {
        type: "firebase",
        label: "Firebase Console",
        url: "https://console.firebase.google.com",
      },
    ],
  },
  "Mitochondria-Landing": {
    description: "Modern product landing page backed by MongoDB Atlas cloud cluster.",
    tags: ["mongodb", "landing-page", "web", "fullstack"],
    status: "active",
    customLinks: [
      {
        type: "mongodb",
        label: "MongoDB Atlas",
        url: "https://cloud.mongodb.com",
      },
    ],
  },
  entrepiTesting: {
    description: "Testing playground for Mongoose schema modeling and backend experimentation.",
    tags: ["mongodb", "mongoose", "react", "testing"],
    status: "active",
    customLinks: [
      {
        type: "mongodb",
        label: "MongoDB Mongoose",
        url: "https://cloud.mongodb.com",
      },
    ],
  },
  "Notes-6th-Sem": {
    description: "Academic study notes, resource documents, and computer science question papers.",
    tags: ["academic", "notes", "education"],
    status: "completed",
  },
  "RECKON-6.0": {
    description: "Official hackathon and tech symposium portal with sponsor management.",
    tags: ["hackathon", "events", "react", "portal"],
    status: "completed",
  },
  altrex: {
    description: "Frontend showcase and interactive UI component collection.",
    tags: ["frontend", "ui", "css", "showcase"],
    status: "completed",
  },
  "divyanshi-portfolio": {
    description: "Creative personal portfolio website designed for work display and contact.",
    tags: ["portfolio", "frontend", "web"],
    status: "completed",
  },
  Blue_Orange_Blockchain: {
    description: "Blockchain smart contracts, technical documentation, and web3 client interactions.",
    tags: ["blockchain", "smart-contracts", "web3", "solidity"],
    status: "completed",
  },
  Nutrigift: {
    description: "Health and wellness nutrition gift product static landing page.",
    tags: ["ecommerce", "landing-page", "frontend"],
    status: "completed",
  },
  "IIT-KHARAGPUR": {
    description: "PyTorch machine learning document extraction model and database integration pipeline.",
    tags: ["pytorch", "machine-learning", "python", "nlp"],
    status: "completed",
  },
  "Gemini-Clone": {
    description: "Conversational AI assistant clone integrating Google Gemini API on the client.",
    tags: ["ai", "gemini", "react", "llm"],
    status: "completed",
  },
  "SMALL-PROJECTS": {
    description: "Collection of JavaScript mini-projects, utility tools, and DOM experiments.",
    tags: ["javascript", "experiments", "mini-projects"],
    status: "completed",
  },
  "Machine-Learning-Algorithms": {
    description: "Comprehensive implementation and benchmark analysis of foundational ML algorithms.",
    tags: ["machine-learning", "python", "data-science"],
    status: "completed",
  },
  "SAR-APP-FLASK": {
    description: "Synthetic Aperture Radar (SAR) image processing web service built with Flask.",
    tags: ["flask", "python", "sar", "radar"],
    status: "completed",
  },
  Forever_final: {
    description: "Production-ready fullstack e-commerce store with cart, payments, and MongoDB backend.",
    tags: ["ecommerce", "mongodb", "nodejs", "react"],
    status: "completed",
    customLinks: [
      {
        type: "mongodb",
        label: "MongoDB /ecommerce",
        url: "https://cloud.mongodb.com",
      },
    ],
  },
  "Beta-10": {
    description: "Fullstack web platform featuring Mongoose database configuration and models.",
    tags: ["mongodb", "fullstack", "nodejs", "express"],
    status: "completed",
    customLinks: [
      {
        type: "mongodb",
        label: "MongoDB /ecommerce",
        url: "https://cloud.mongodb.com",
      },
    ],
  },
  MCONNECT: {
    description: "Community connection portal and static social web directory.",
    tags: ["web", "community", "html", "css"],
    status: "completed",
  },
  STOCK_PRICE_PREDICTION: {
    description: "Time-series stock price forecasting model trained on historical market data.",
    tags: ["machine-learning", "python", "stocks", "finance"],
    status: "completed",
  },
  forvever_v1: {
    description: "Initial design and component prototype for the Forever online store.",
    tags: ["ecommerce", "prototype", "react"],
    status: "completed",
  },
  "FLAVOUR-HUNT": {
    description: "Recipe discovery portal and culinary guide with responsive UI layout.",
    tags: ["frontend", "html", "css", "food"],
    status: "completed",
  },
  "SAR-COLORIZATION": {
    description: "Deep learning models for Synthetic Aperture Radar (SAR) imagery colorization.",
    tags: ["deep-learning", "python", "sar", "computer-vision"],
    status: "completed",
  },
  "PORTFOLIO-MAIN": {
    description: "First edition personal web portfolio showcasing student projects and skills.",
    tags: ["portfolio", "html", "css"],
    status: "completed",
  },
  BLOG_SITE_USING_EJS: {
    description: "Server-rendered blogging platform built with Node.js, Express, and EJS templates.",
    tags: ["nodejs", "express", "ejs", "blog"],
    status: "completed",
  },
  weather_forcast: {
    description: "Real-time weather forecast web app with Mailchimp subscriber newsletter integration.",
    tags: ["weather", "api", "express", "nodejs"],
    status: "completed",
  },
  Drum_kit: {
    description: "Interactive musical instrument web game with keyboard shortcuts and audio playback.",
    tags: ["javascript", "game", "audio", "dom"],
    status: "completed",
  },
  Dice_Game: {
    description: "Two-player interactive dice roll battle game with dynamic DOM updates.",
    tags: ["javascript", "game", "dom"],
    status: "completed",
  },
  tp: {
    description: "Quick HTML/CSS experiment and frontend testing sandbox.",
    tags: ["frontend", "utility", "html"],
    status: "completed",
  },
  date_time: {
    description: "Real-time interactive digital clock and date utility.",
    tags: ["javascript", "clock", "utility"],
    status: "completed",
  },
  "U-nite": {
    description: "Student networking and university collaboration portal.",
    tags: ["community", "html", "css"],
    status: "completed",
  },
  "Car-Univerz": {
    description: "Automobile enthusiast gallery and vehicle catalog web site.",
    tags: ["automotive", "frontend", "web"],
    status: "completed",
  },
  JIETMUN: {
    description: "Official conference website for JIET Model United Nations assembly.",
    tags: ["conference", "mun", "event", "website"],
    status: "completed",
  },
  caruniverz: {
    description: "Early web prototype of the Car Univerz automotive information portal.",
    tags: ["automotive", "gallery", "html"],
    status: "completed",
  },
};

interface RawItem {
  name: string;
  url: string;
  path?: string;
  dbs: string[];
  last_commit: string;
  recent_commits?: string[];
}

async function run() {
  console.log("Connecting to MongoDB Atlas...");
  await mongoose.connect(MONGODB_URI, { dbName: "project_tracker" });
  console.log("Connected successfully!");

  const jsonPath = "/home/keshav/.gemini/antigravity/brain/b9c12f5e-1535-4e90-bc8a-131d2d286909/scratch/project_details.json";
  let items: RawItem[] = [];

  if (fs.existsSync(jsonPath)) {
    const rawData = fs.readFileSync(jsonPath, "utf-8");
    items = JSON.parse(rawData);
    console.log(`Loaded ${items.length} projects from ${jsonPath}`);
  } else {
    console.error(`File not found at ${jsonPath}`);
    process.exit(1);
  }

  // Also include the Project Tracker itself as project #50
  items.unshift({
    name: "Project Tracker",
    url: "https://github.com/mrKESHAV2004/project-tracker",
    dbs: ["mongodb+srv://shrimalikeshav4_db_user:****@cluster0.1jgcpxz.mongodb.net/project_tracker"],
    last_commit: "2026-11-18 | Feat: Full-stack Next.js project tracker connected to MongoDB Atlas",
    recent_commits: [
      "2026-11-18 | Feat: Full-stack Next.js project tracker connected to MongoDB Atlas",
      "2026-11-18 | UI: Added KPI stats overview, table/grid toggle, brand link icons",
      "2026-11-18 | Initial project setup with App Router, TypeScript, and Mongoose",
    ],
  });

  let insertedCount = 0;
  let updatedCount = 0;

  for (const item of items) {
    const meta = REPO_METADATA[item.name] || {
      description: `${item.name} development repository.`,
      tags: ["web"],
      status: "active",
    };

    // Determine status
    let status: ProjectStatus = meta.status || "active";
    if (!meta.status) {
      if (item.last_commit && (item.last_commit.startsWith("2026") || item.last_commit.startsWith("2025-1"))) {
        status = "active";
      } else {
        status = "completed";
      }
    }

    // Build links
    const links: IProjectLink[] = [
      {
        type: "github",
        label: "GitHub Repo",
        url: item.url,
      },
    ];

    // Add DB links from detected dbs
    if (item.dbs && Array.isArray(item.dbs)) {
      for (const dbEntry of item.dbs) {
        if (!dbEntry || dbEntry === "None / N/A") continue;

        if (dbEntry.toLowerCase().includes("mongodb") || dbEntry.toLowerCase().includes("cluster")) {
          // Avoid duplicate
          if (!links.some((l) => l.type === "mongodb")) {
            links.push({
              type: "mongodb",
              label: "MongoDB",
              url: dbEntry.startsWith("http") ? dbEntry : "https://cloud.mongodb.com",
            });
          }
        } else if (dbEntry.toLowerCase().includes("supabase")) {
          if (!links.some((l) => l.type === "supabase")) {
            const url = dbEntry.startsWith("http") ? dbEntry : "https://supabase.com";
            links.push({
              type: "supabase",
              label: "Supabase DB",
              url,
            });
          }
        } else if (dbEntry.toLowerCase().includes("firebase")) {
          if (!links.some((l) => l.type === "firebase")) {
            links.push({
              type: "firebase",
              label: "Firebase",
              url: "https://console.firebase.google.com",
            });
          }
        }
      }
    }

    // Append custom predefined links if any
    if (meta.customLinks) {
      for (const cl of meta.customLinks) {
        if (!links.some((l) => l.type === cl.type && l.url === cl.url)) {
          links.push(cl);
        }
      }
    }

    // Build notes from recent commits
    const notes: IProjectNote[] = [];
    const commits = item.recent_commits && item.recent_commits.length > 0
      ? item.recent_commits
      : item.last_commit && item.last_commit !== "No commits found"
      ? [item.last_commit]
      : [];

    for (const c of commits) {
      let content = c;
      let date = new Date();

      if (c.includes("|")) {
        const parts = c.split("|");
        const dateStr = parts[0].trim();
        const msg = parts.slice(1).join("|").trim();
        content = msg;
        const parsed = new Date(dateStr);
        if (!isNaN(parsed.getTime())) {
          date = parsed;
        }
      } else if (c.includes("—")) {
        const parts = c.split("—");
        const dateStr = parts[0].trim();
        const msg = parts.slice(1).join("—").trim();
        content = msg;
        const parsed = new Date(dateStr);
        if (!isNaN(parsed.getTime())) {
          date = parsed;
        }
      }

      notes.push({
        content,
        createdAt: date,
      });
    }

    // If no notes, add a default
    if (notes.length === 0) {
      notes.push({
        content: `Repository imported from GitHub (${item.name})`,
        createdAt: new Date(),
      });
    }

    // Upsert project in database
    const existing = await Project.findOne({ name: item.name });
    if (existing) {
      existing.description = meta.description;
      existing.status = status;
      existing.tags = meta.tags;
      existing.links = links;
      existing.notes = notes;
      await existing.save();
      updatedCount++;
    } else {
      await Project.create({
        name: item.name,
        description: meta.description,
        status,
        tags: meta.tags,
        links,
        notes,
      });
      insertedCount++;
    }
  }

  console.log(`\n========================================`);
  console.log(`✅ Import finished successfully!`);
  console.log(`• Inserted new projects: ${insertedCount}`);
  console.log(`• Updated existing projects: ${updatedCount}`);
  console.log(`• Total projects in database: ${await Project.countDocuments()}`);
  console.log(`========================================\n`);

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("Import failed:", err);
  process.exit(1);
});
