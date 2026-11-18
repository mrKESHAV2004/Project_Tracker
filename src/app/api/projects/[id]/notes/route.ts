import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Project, IProjectNote } from "@/models/Project";
import { getCurrentUserFromHeaders } from "@/lib/auth";
import mongoose, { Types } from "mongoose";

interface RouteParams {
  params: Promise<{ id: string }>;
}

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
    if (!body.content || !body.content.trim()) {
      return NextResponse.json(
        { success: false, error: "Note content is required" },
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

    const newNote = {
      content: body.content.trim(),
      createdAt: new Date(),
    };

    project.notes.unshift(newNote as unknown as IProjectNote);
    await project.save();

    return NextResponse.json({
      success: true,
      notes: project.notes,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to add note";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

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
    const noteId = searchParams.get("noteId");

    if (!noteId) {
      return NextResponse.json(
        { success: false, error: "noteId query param is required" },
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

    project.notes = project.notes.filter((note) => {
      const currentNoteId = (note as unknown as { _id?: Types.ObjectId })._id?.toString();
      return currentNoteId !== noteId;
    });
    await project.save();

    return NextResponse.json({
      success: true,
      notes: project.notes,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete note";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
