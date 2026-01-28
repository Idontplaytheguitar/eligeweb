import { prisma } from "./prisma";

const DEFAULT_ADMIN_EMAIL = "contacto@estudioelige.com";
const DEFAULT_EMAIL_SENDER_NAME = "ELIGE - Estudio Legal";
const DEFAULT_WHATSAPP_MESSAGE = "Hola, quisiera hacer una consulta legal.";
const LOCKOUT_MINUTES = 5;
const MAX_LOGIN_ATTEMPTS = 5;

export interface AdminConfigData {
  adminEmail: string | null;
  notifyOnContact: boolean;
  notifyOnBooking: boolean;
  emailSenderName: string | null;
  whatsappDefaultMessage: string | null;
  contactAutoReplyEnabled: boolean;
  contactAutoReplyText: string | null;
  absenceNoticeEnabled: boolean;
  absenceNoticeText: string | null;
}

async function getConfigRow() {
  const row = await prisma.adminConfig.findUnique({
    where: { id: "main" },
  });
  return row;
}

/**
 * Toda la config del admin desde DB. Valores por defecto solo cuando la fila no existe.
 */
export async function getAdminConfig(): Promise<AdminConfigData> {
  const row = await getConfigRow();
  if (!row) {
    return {
      adminEmail: process.env.ADMIN_EMAIL?.trim() || null,
      notifyOnContact: true,
      notifyOnBooking: true,
      emailSenderName: null,
      whatsappDefaultMessage: null,
      contactAutoReplyEnabled: false,
      contactAutoReplyText: null,
      absenceNoticeEnabled: false,
      absenceNoticeText: null,
    };
  }
  return {
    adminEmail: row.adminEmail?.trim() ? row.adminEmail.trim().toLowerCase() : null,
    notifyOnContact: row.notifyOnContact ?? true,
    notifyOnBooking: row.notifyOnBooking ?? true,
    emailSenderName: row.emailSenderName?.trim() || null,
    whatsappDefaultMessage: row.whatsappDefaultMessage?.trim() || null,
    contactAutoReplyEnabled: row.contactAutoReplyEnabled ?? false,
    contactAutoReplyText: row.contactAutoReplyText?.trim() || null,
    absenceNoticeEnabled: row.absenceNoticeEnabled ?? false,
    absenceNoticeText: row.absenceNoticeText?.trim() || null,
  };
}

/**
 * Resolved admin email for sending (DB → env → SMTP_USER → default).
 * Use in email.ts and auth for OTP/change password.
 */
export async function getAdminEmail(): Promise<string> {
  const config = await getAdminConfig();
  if (config.adminEmail) return config.adminEmail;
  return (
    process.env.ADMIN_EMAIL?.trim() ||
    process.env.SMTP_USER?.trim() ||
    DEFAULT_ADMIN_EMAIL
  );
}

/**
 * Admin email for settings UI: from DB (getAdminConfig).
 */
export async function getAdminEmailForSettings(): Promise<string | null> {
  const config = await getAdminConfig();
  return config.adminEmail;
}

export async function getNotifyOnContact(): Promise<boolean> {
  const config = await getAdminConfig();
  return config.notifyOnContact;
}

export async function getNotifyOnBooking(): Promise<boolean> {
  const config = await getAdminConfig();
  return config.notifyOnBooking;
}

/**
 * Nombre del estudio en correos (from, pie). Desde DB; si viene vacío se usa DEFAULT_EMAIL_SENDER_NAME.
 */
export async function getEmailSenderName(): Promise<string> {
  const config = await getAdminConfig();
  return config.emailSenderName || DEFAULT_EMAIL_SENDER_NAME;
}

/**
 * Mensaje por defecto para links de WhatsApp. Desde DB; si vacío usa DEFAULT_WHATSAPP_MESSAGE.
 */
export async function getWhatsappDefaultMessage(): Promise<string> {
  const config = await getAdminConfig();
  return config.whatsappDefaultMessage || DEFAULT_WHATSAPP_MESSAGE;
}

export async function getContactAutoReplyEnabled(): Promise<boolean> {
  const config = await getAdminConfig();
  return config.contactAutoReplyEnabled;
}

export async function getContactAutoReplyText(): Promise<string | null> {
  const config = await getAdminConfig();
  return config.contactAutoReplyText;
}

export async function getAbsenceNoticeEnabled(): Promise<boolean> {
  const config = await getAdminConfig();
  return config.absenceNoticeEnabled;
}

export async function getAbsenceNoticeText(): Promise<string | null> {
  const config = await getAdminConfig();
  return config.absenceNoticeText;
}

/**
 * Persist admin config in DB. Acepta campos parciales.
 */
export async function updateAdminConfig(data: {
  adminEmail?: string | null;
  notifyOnContact?: boolean;
  notifyOnBooking?: boolean;
  emailSenderName?: string | null;
  whatsappDefaultMessage?: string | null;
  contactAutoReplyEnabled?: boolean;
  contactAutoReplyText?: string | null;
  absenceNoticeEnabled?: boolean;
  absenceNoticeText?: string | null;
}): Promise<void> {
  const update: Record<string, unknown> = {};
  if (data.adminEmail !== undefined) {
    update.adminEmail = data.adminEmail === "" || data.adminEmail === null ? null : data.adminEmail.trim().toLowerCase();
  }
  if (data.notifyOnContact !== undefined) update.notifyOnContact = data.notifyOnContact;
  if (data.notifyOnBooking !== undefined) update.notifyOnBooking = data.notifyOnBooking;
  if (data.emailSenderName !== undefined) update.emailSenderName = data.emailSenderName === "" || data.emailSenderName === null ? null : data.emailSenderName.trim();
  if (data.whatsappDefaultMessage !== undefined) update.whatsappDefaultMessage = data.whatsappDefaultMessage === "" || data.whatsappDefaultMessage === null ? null : data.whatsappDefaultMessage.trim();
  if (data.contactAutoReplyEnabled !== undefined) update.contactAutoReplyEnabled = data.contactAutoReplyEnabled;
  if (data.contactAutoReplyText !== undefined) update.contactAutoReplyText = data.contactAutoReplyText === "" || data.contactAutoReplyText === null ? null : data.contactAutoReplyText.trim();
  if (data.absenceNoticeEnabled !== undefined) update.absenceNoticeEnabled = data.absenceNoticeEnabled;
  if (data.absenceNoticeText !== undefined) update.absenceNoticeText = data.absenceNoticeText === "" || data.absenceNoticeText === null ? null : data.absenceNoticeText.trim();

  if (Object.keys(update).length === 0) return;

  await prisma.adminConfig.upsert({
    where: { id: "main" },
    update,
    create: {
      id: "main",
      adminEmail: (update.adminEmail as string | null) ?? null,
      notifyOnContact: (update.notifyOnContact as boolean) ?? true,
      notifyOnBooking: (update.notifyOnBooking as boolean) ?? true,
      emailSenderName: (update.emailSenderName as string | null) ?? null,
      whatsappDefaultMessage: (update.whatsappDefaultMessage as string | null) ?? null,
      contactAutoReplyEnabled: (update.contactAutoReplyEnabled as boolean) ?? false,
      contactAutoReplyText: (update.contactAutoReplyText as string | null) ?? null,
      absenceNoticeEnabled: (update.absenceNoticeEnabled as boolean) ?? false,
      absenceNoticeText: (update.absenceNoticeText as string | null) ?? null,
    },
  });
}

/** @deprecated Use updateAdminConfig */
export async function setAdminEmail(email: string): Promise<void> {
  await updateAdminConfig({ adminEmail: email });
}

// --- Login attempt limit (5 intentos, 5 min) ---

function hashIp(ip: string): string {
  return ip.replace(/[^a-fA-F0-9.:]/g, "").slice(-64) || "unknown";
}

export async function checkLoginLocked(ip: string): Promise<{ locked: true; retryAfterSeconds: number } | { locked: false }> {
  const ipHash = hashIp(ip);
  const row = await prisma.adminLoginAttempt.findUnique({
    where: { ipHash },
  });
  if (!row?.lockedUntil) return { locked: false };
  const now = new Date();
  if (row.lockedUntil <= now) {
    await prisma.adminLoginAttempt.delete({ where: { ipHash } }).catch(() => {});
    return { locked: false };
  }
  const retryAfterSeconds = Math.ceil((row.lockedUntil.getTime() - now.getTime()) / 1000);
  return { locked: true, retryAfterSeconds };
}

export async function recordLoginFailure(ip: string): Promise<{ locked: true; retryAfterSeconds: number } | { locked: false }> {
  const ipHash = hashIp(ip);
  const now = new Date();
  const lockedUntil = new Date(now.getTime() + LOCKOUT_MINUTES * 60 * 1000);

  const updated = await prisma.adminLoginAttempt.upsert({
    where: { ipHash },
    update: {
      attemptCount: { increment: 1 },
      updatedAt: now,
    },
    create: { ipHash, attemptCount: 1, updatedAt: now },
  });

  const count = updated.attemptCount;
  if (count >= MAX_LOGIN_ATTEMPTS) {
    await prisma.adminLoginAttempt.update({
      where: { ipHash },
      data: { lockedUntil, updatedAt: now },
    });
    return { locked: true, retryAfterSeconds: LOCKOUT_MINUTES * 60 };
  }
  return { locked: false };
}

export async function clearLoginAttempts(ip: string): Promise<void> {
  const ipHash = hashIp(ip);
  await prisma.adminLoginAttempt.deleteMany({ where: { ipHash } });
}
