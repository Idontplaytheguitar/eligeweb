import { NextRequest, NextResponse } from "next/server";
import {
  verifyPassword,
  createSession,
  validateSession,
  deleteSession,
  setSessionCookie,
  clearSessionCookie,
  getSessionToken,
  createOTP,
  verifyOTP,
  setAdminPassword,
} from "@/lib/auth";
import {
  getAdminEmail,
  getAdminEmailForSettings,
  checkLoginLocked,
  recordLoginFailure,
  clearLoginAttempts,
} from "@/lib/admin-settings";
import { sendOTPEmail } from "@/lib/email";

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const real = request.headers.get("x-real-ip");
  if (real) return real.trim();
  return "127.0.0.1";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, password, otp, newPassword } = body;

    if (action === "check") {
      const isValid = await validateSession();
      return NextResponse.json({ authenticated: isValid });
    }

    if (action === "login") {
      if (!password) {
        return NextResponse.json(
          { error: "Contraseña requerida" },
          { status: 400 }
        );
      }

      const ip = getClientIp(request);
      const lock = await checkLoginLocked(ip);
      if (lock.locked) {
        const min = Math.ceil(lock.retryAfterSeconds / 60);
        return NextResponse.json(
          { error: `Demasiados intentos. Probá de nuevo en ${min} minuto${min !== 1 ? "s" : ""}.` },
          { status: 429 }
        );
      }

      const isValid = await verifyPassword(password);

      if (!isValid) {
        const afterFail = await recordLoginFailure(ip);
        if (afterFail.locked) {
          return NextResponse.json(
            { error: "Demasiados intentos. Probá de nuevo en 5 minutos." },
            { status: 429 }
          );
        }
        return NextResponse.json(
          { error: "Contraseña incorrecta" },
          { status: 401 }
        );
      }

      await clearLoginAttempts(ip);
      const token = await createSession();
      await setSessionCookie(token);

      return NextResponse.json({ success: true });
    }

    if (action === "logout") {
      const token = await getSessionToken();
      if (token) {
        await deleteSession(token);
      }
      await clearSessionCookie();
      return NextResponse.json({ success: true });
    }

    if (action === "request_otp") {
      const isAuthenticated = await validateSession();
      if (!isAuthenticated) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
      }

      const configured = await getAdminEmailForSettings();
      if (!configured) {
        return NextResponse.json(
          { error: "Email de admin no configurado" },
          { status: 400 }
        );
      }

      const adminEmail = await getAdminEmail();
      const otpCode = await createOTP(adminEmail);

      try {
        await sendOTPEmail(adminEmail, otpCode);
      } catch {
        console.log("SMTP not configured, OTP:", otpCode);
      }

      const maskedEmail = adminEmail.replace(/(.{2})(.*)(@.*)/, "$1***$3");
      return NextResponse.json({ success: true, email: maskedEmail });
    }

    if (action === "change_password") {
      const isAuthenticated = await validateSession();
      if (!isAuthenticated) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
      }

      const configured = await getAdminEmailForSettings();
      if (!configured) {
        return NextResponse.json(
          { error: "Email de admin no configurado" },
          { status: 400 }
        );
      }

      const adminEmail = await getAdminEmail();
      const isValidOTP = await verifyOTP(adminEmail, otp);
      if (!isValidOTP) {
        return NextResponse.json(
          { error: "Código inválido o expirado" },
          { status: 400 }
        );
      }

      if (!newPassword || newPassword.length < 6) {
        return NextResponse.json(
          { error: "La contraseña debe tener al menos 6 caracteres" },
          { status: 400 }
        );
      }

      const success = await setAdminPassword(newPassword);
      if (!success) {
        return NextResponse.json(
          { error: "Error al guardar la contraseña" },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Acción inválida" }, { status: 400 });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
