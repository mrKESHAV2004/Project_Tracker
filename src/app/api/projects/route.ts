import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Project } from "@/models/Project";
import { getCurrentUserFromHeaders } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUserFromHeaders();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const query: Record<string, unknown> = {};

    if (status && status !== "all") {
      query.status = status;
    }

    if (category && category !== "all") {
      query.category = category;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { clientName: searchRegex },
        { tags: searchRegex },
      ];
    }

    const rawProjects = await Project.find(query).lean();
    // Priority order: 1) Pinned projects first, 2) Active projects next, 3) Most recently updated
    const projects = rawProjects.sort((a, b) => {
      const pinA = a.pinned ? 1 : 0;
      const pinB = b.pinned ? 1 : 0;
      if (pinB !== pinA) return pinB - pinA;

      const activeA = a.status === "active" ? 1 : 0;
      const activeB = b.status === "active" ? 1 : 0;
      if (activeB !== activeA) return activeB - activeA;

      const timeA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const timeB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return timeB - timeA;
    });

    return NextResponse.json({ success: true, projects });
  } catch (error: unknown) {
    console.error("Error fetching projects:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch projects";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUserFromHeaders();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const body = await req.json();

    if (!body.name || !body.name.trim()) {
      return NextResponse.json(
        { success: false, error: "Project name is required" },
        { status: 400 }
      );
    }

    const newProject = await Project.create({
      name: body.name.trim(),
      description: body.description?.trim() || "",
      category: body.category === "client" ? "client" : "personal",
      clientName: body.category === "client" ? (body.clientName?.trim() || "") : "",
      status: body.status || "active",
      pinned: Boolean(body.pinned),
      links: Array.isArray(body.links) ? body.links : [],
      notes: Array.isArray(body.notes) ? body.notes : [],
      tasks: Array.isArray(body.tasks) ? body.tasks : [],
      tags: Array.isArray(body.tags)
        ? body.tags.map((t: string) => t.trim()).filter(Boolean)
        : [],
    });

    return NextResponse.json(
      { success: true, project: newProject },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error creating project:", error);
    const message = error instanceof Error ? error.message : "Failed to create project";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
