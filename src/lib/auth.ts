import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export const AUTH_COOKIE_NAME = 'project_tracker_session';

const SECRET_KEY = process.env.AUTH_SECRET || 'project_tracker_default_jwt_secret_key_2026';
const key = new TextEncoder().encode(SECRET_KEY);

export interface TokenPayload {
  userId: string;
  email?: string;
  username: string;
  name?: string;
  role?: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function signJWT(payload: TokenPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(key);
}

export async function verifyJWT(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ['HS256'],
    });
    return payload as unknown as TokenPayload;
  } catch {
    return null;
  }
}

export async function getCurrentUserFromHeaders(): Promise<TokenPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;
    return verifyJWT(token);
  } catch {
    return null;
  }
}

export async function getCurrentUserFromRequest(req: NextRequest): Promise<TokenPayload | null> {
  try {
    const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;
    return verifyJWT(token);
  } catch {
    return null;
  }
}
