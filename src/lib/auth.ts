import { cookies } from "next/headers";
import { prisma } from "./prisma";
import bcrypt from "bcrypt";
import crypto from "crypto";

const SESSION_COOKIE = "elige_admin_session";
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export async function getAdminPassword(): Promise<string> {
  try {
    const customPassword = await prisma.adminPassword.findUnique({
      where: { id: "main" },
    });
    if (customPassword) {
      return customPassword.password;
    }
  } catch {
    // Table might not exist yet
  }
  // Return env password or throw error if not set
  if (!process.env.ADMIN_PASSWORD) {
    throw new Error("ADMIN_PASSWORD environment variable is not set");
  }
  return process.env.ADMIN_PASSWORD;
}

export async function setAdminPassword(password: string): Promise<boolean> {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.adminPassword.upsert({
      where: { id: "main" },
      update: { password: hashedPassword },
      create: { id: "main", password: hashedPassword },
    });
    return true;
  } catch (error) {
    console.error("Error setting admin password:", error);
    return false;
  }
}

export async function verifyPassword(password: string): Promise<boolean> {
  const envPassword = process.env.ADMIN_PASSWORD;
  if (envPassword && password === envPassword) {
    return true;
  }

  try {
    const customPassword = await prisma.adminPassword.findUnique({
      where: { id: "main" },
    });
    if (customPassword) {
      return bcrypt.compare(password, customPassword.password);
    }
  } catch {
    // Table might not exist yet
  }

  return false;
}

export async function createSession(): Promise<string> {
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_DURATION);

  await prisma.adminSession.create({
    data: { token, expiresAt },
  });

  return token;
}

export async function validateSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return false;
  }

  try {
    const session = await prisma.adminSession.findUnique({
      where: { token },
    });

    if (!session || session.expiresAt < new Date()) {
      if (session) {
        await prisma.adminSession.delete({ where: { id: session.id } });
      }
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export async function deleteSession(token: string): Promise<void> {
  try {
    await prisma.adminSession.delete({ where: { token } });
  } catch {
    // Session might not exist
  }
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION / 1000,
    path: "/",
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSessionToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value;
}

export async function createOTP(email: string): Promise<string> {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await prisma.oTP.create({
    data: { email, code, expiresAt },
  });

  return code;
}

export async function verifyOTP(email: string, code: string): Promise<boolean> {
  try {
    const otp = await prisma.oTP.findFirst({
      where: { email, code, expiresAt: { gt: new Date() } },
    });

    if (otp) {
      await prisma.oTP.delete({ where: { id: otp.id } });
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export async function cleanExpiredSessions(): Promise<void> {
  try {
    await prisma.adminSession.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
  } catch {
    // Table might not exist
  }
}
