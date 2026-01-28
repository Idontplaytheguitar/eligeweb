import { prisma } from "./prisma";

const DEFAULT_ADMIN_EMAIL = "contacto@estudioelige.com";

/**
 * Resolved admin email for sending (DB → env → SMTP_USER → default).
 * Use in email.ts and auth for OTP/change password.
 */
export async function getAdminEmail(): Promise<string> {
  try {
    const row = await prisma.adminConfig.findUnique({
      where: { id: "main" },
    });
    if (row?.adminEmail?.trim()) {
      return row.adminEmail.trim().toLowerCase();
    }
  } catch {
    // Table might not exist yet
  }
  return (
    process.env.ADMIN_EMAIL?.trim() ||
    process.env.SMTP_USER?.trim() ||
    DEFAULT_ADMIN_EMAIL
  );
}

/**
 * Admin email for settings UI: DB or env only, null if neither is set.
 * Used to know if "Cambiar contraseña" is available and to show current value.
 */
export async function getAdminEmailForSettings(): Promise<string | null> {
  try {
    const row = await prisma.adminConfig.findUnique({
      where: { id: "main" },
    });
    if (row?.adminEmail?.trim()) {
      return row.adminEmail.trim().toLowerCase();
    }
  } catch {
    // Table might not exist yet
  }
  const fromEnv = process.env.ADMIN_EMAIL?.trim();
  return fromEnv ? fromEnv.toLowerCase() : null;
}

/**
 * Persist admin email in DB (used by POST /api/admin/settings).
 */
export async function setAdminEmail(email: string): Promise<void> {
  const value = email.trim().toLowerCase();
  await prisma.adminConfig.upsert({
    where: { id: "main" },
    update: { adminEmail: value },
    create: { id: "main", adminEmail: value },
  });
}
