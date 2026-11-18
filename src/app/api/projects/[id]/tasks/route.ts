import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Project, IProjectTask, TaskStatus } from "@/models/Project";
import { getCurrentUserFromHeaders } from "@/lib/auth";
import mongoose, { Types } from "mongoose";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST: add a new task
export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUserFromHeaders();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid project ID" },
        { status: 400 }
      );
    }

    const body = await req.json();
    if (!body.title || !body.title.trim()) {
      return NextResponse.json(
        { success: false, error: "Task title is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    const newTask = {
      title: body.title.trim(),
      status: body.status || "planned",
      createdAt: new Date(),
    };

    project.tasks.push(newTask as unknown as IProjectTask);
    await project.save();

    return NextResponse.json({ success: true, tasks: project.tasks });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to add task";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

// PUT: update a task's status (or title)
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUserFromHeaders();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid project ID" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const taskId = body.taskId;
    if (!taskId) {
      return NextResponse.json(
        { success: false, error: "taskId is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    const task = project.tasks.find(
      (t) => (t as unknown as { _id?: Types.ObjectId })._id?.toString() === taskId
    );
    if (!task) {
      return NextResponse.json(
        { success: false, error: "Task not found" },
        { status: 404 }
      );
    }

    if (body.status) task.status = body.status as TaskStatus;
    if (body.title !== undefined) task.title = body.title.trim();
    await project.save();

    return NextResponse.json({ success: true, tasks: project.tasks });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update task";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

// DELETE: remove a task
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUserFromHeaders();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid project ID" },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get("taskId");
    if (!taskId) {
      return NextResponse.json(
        { success: false, error: "taskId query param is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    project.tasks = project.tasks.filter((t) => {
      const tid = (t as unknown as { _id?: Types.ObjectId })._id?.toString();
      return tid !== taskId;
    });
    await project.save();

    return NextResponse.json({ success: true, tasks: project.tasks });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to delete task";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
