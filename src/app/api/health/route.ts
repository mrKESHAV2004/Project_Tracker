import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    const conn = await connectToDatabase();
    const isConnected = conn.connection.readyState === 1;

    return NextResponse.json({
      connected: isConnected,
      host: conn.connection.host || "localhost",
      name: conn.connection.name || "project_tracker",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Database connection failed";
    return NextResponse.json(
      {
        connected: false,
        error: message,
      },
      { status: 503 }
    );
  }
}
