import { NextResponse } from 'next/server';
import { getCurrentUserFromHeaders } from '@/lib/auth';

export async function GET() {
  try {
    const sessionUser = await getCurrentUserFromHeaders();
    if (!sessionUser) {
      return NextResponse.json({
        authenticated: false,
      });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        userId: sessionUser.userId,
        email: sessionUser.email || sessionUser.username,
        username: sessionUser.username,
        name: sessionUser.name,
        role: sessionUser.role,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Auth verification error';
    return NextResponse.json({ authenticated: false, error: message }, { status: 500 });
  }
}
