import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import readline from "readline";
import bcrypt from "bcryptjs";

// 1. Load environment variables from .env.local or .env
function loadEnv() {
  const envFiles = [".env.local", ".env"];
  for (const file of envFiles) {
    const fullPath = path.resolve(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, "utf-8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx !== -1) {
          const key = trimmed.slice(0, eqIdx).trim();
          let val = trimmed.slice(eqIdx + 1).trim();
          if (
            (val.startsWith('"') && val.endsWith('"')) ||
            (val.startsWith("'") && val.endsWith("'"))
          ) {
            val = val.slice(1, -1);
          }
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    }
  }
}

loadEnv();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/project_tracker";

// Simple prompt helper for interactive mode
function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

// User Schema
const UserSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, sparse: true, trim: true, lowercase: true },
    username: { type: String, unique: true, sparse: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    name: { type: String, default: "Admin" },
    role: { type: String, default: "admin" },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function main() {
  const args = process.argv.slice(2);
  let email = args[0];
  let password = args[1];
  let name = args[2];

  console.log("\n========================================");
  console.log(" 🔑  Project Tracker — Create User CLI ");
  console.log("========================================\n");

  if (!email) {
    email = await prompt("Enter email: ");
  }

  if (!email || !email.includes("@")) {
    console.error("❌ Error: A valid email address is required.");
    process.exit(1);
  }

  if (!password) {
    password = await prompt("Enter password (min 6 characters): ");
  }

  if (!password || password.length < 6) {
    console.error("❌ Error: Password must be at least 6 characters.");
    process.exit(1);
  }

  if (!name) {
    name = (await prompt("Enter display name (optional, press Enter for 'Keshav'): ")) || "Keshav";
  }

  console.log("\nConnecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);

  const cleanEmail = email.toLowerCase().trim();
  const hashedPassword = await bcrypt.hash(password, 10);

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email: cleanEmail }, { username: cleanEmail }],
  });

  if (existingUser) {
    existingUser.email = cleanEmail;
    existingUser.username = cleanEmail;
    existingUser.password = hashedPassword;
    if (name) existingUser.name = name;
    await existingUser.save();

    console.log("\n✅ User already existed — password & details updated successfully!");
    console.log(`   Email: ${cleanEmail}`);
    console.log(`   Name:  ${existingUser.name}`);
    console.log(`   Role:  ${existingUser.role}\n`);
  } else {
    const newUser = await User.create({
      email: cleanEmail,
      username: cleanEmail,
      password: hashedPassword,
      name: name || "Keshav",
      role: "admin",
    });

    console.log("\n✅ User created successfully!");
    console.log(`   Email: ${newUser.email}`);
    console.log(`   Name:  ${newUser.name}`);
    console.log(`   Role:  ${newUser.role}\n`);
  }

  await mongoose.disconnect();
  console.log("You can now sign in at http://localhost:3000\n");
}

main().catch((err) => {
  console.error("❌ Failed to create user:", err);
  process.exit(1);
});
